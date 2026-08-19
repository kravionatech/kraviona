import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/apps/app.js";
import { getAllCategories } from "../src/controllers/categories/categories.controller.js";
import { buildTeamPayload } from "../src/controllers/team/team.controller.js";
import { CategoryModel } from "../src/models/blog/category.model.js";
import { PostModel, normalizePublishedAt } from "../src/models/blog/post.model.js";
import {
  appendPublicPostFilterClause,
  publicPostFilter,
} from "../src/controllers/post/post.controller.js";
import { mergeNestedFields, parseBoolean } from "../src/utils/requestValues.js";
import { buildCareerPayload } from "../src/controllers/careers/careers.controller.js";
import { CareerModel } from "../src/models/Careers/career.model.js";

const createResponse = () => ({
  statusCode: 200,
  payload: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.payload = payload;
    return this;
  },
});

test("boolean request values do not treat the string 'false' as true", () => {
  assert.equal(parseBoolean(false, true), false);
  assert.equal(parseBoolean("false", true), false);
  assert.equal(parseBoolean("0", true), false);
  assert.equal(parseBoolean("true", false), true);
  assert.equal(parseBoolean(undefined, true), true);
});

test("team PATCH normalization only includes fields supplied by the client", () => {
  const payload = buildTeamPayload(
    { designation: "  Engineering Lead  ", isFeatured: "false" },
    { partial: true },
  );

  assert.deepEqual(payload, {
    designation: "Engineering Lead",
    isFeatured: false,
  });
  assert.equal("name" in payload, false);
  assert.equal("skills" in payload, false);
  assert.equal("status" in payload, false);
});

test("nested service PATCH data preserves fields omitted from nested objects", () => {
  const merged = mergeNestedFields(
    { seo: { metaTitle: "Existing title", noIndex: false }, title: "Service" },
    { seo: { noIndex: true } },
    ["seo"],
  );

  assert.deepEqual(merged.seo, { metaTitle: "Existing title", noIndex: true });
});

test("career request payload normalizes structured job data", () => {
  const payload = buildCareerPayload({
    jobTitle: "  Senior MERN Developer  ",
    summary: "  Build reliable products with an experienced delivery team.  ",
    content: "Detailed role content ".repeat(8),
    skills: ["Node.js", " React ", ""],
    compensation: { minimum: "600000", isDisclosed: "false" },
    application: { email: " CAREERS@KRAVIONA.COM " },
  });

  assert.equal(payload.jobTitle, "Senior MERN Developer");
  assert.deepEqual(payload.skills, ["Node.js", "React"]);
  assert.equal(payload.compensation.minimum, 600000);
  assert.equal(payload.compensation.isDisclosed, false);
  assert.equal(payload.application.email, "careers@kraviona.com");
});

test("published careers require an application target and receive a slug", async () => {
  const career = new CareerModel({
    jobTitle: "Platform Engineer",
    summary: "Own reliable platform systems for growing product teams.",
    content: "Design, operate, document, and improve reliable platform services for product engineering teams. ".repeat(2),
    status: "published",
  });

  await assert.rejects(career.validate(), /application email or URL/i);
  assert.equal(career.slug, "platform-engineer");
});

test("blog source and statistic schemas accept the admin editor field names", () => {
  const post = new PostModel({
    sources: [{ name: "MDN", url: "https://developer.mozilla.org", publishedDate: "2026-08-01" }],
    statistics: [{ stat: "75% adoption", source: "Industry survey", year: 2026 }],
  });

  assert.equal(post.sources[0].name, "MDN");
  assert.equal(post.sources[0].publishedDate, "2026-08-01");
  assert.equal(post.statistics[0].stat, "75% adoption");
  assert.equal(post.statistics[0].source, "Industry survey");
});

test("published posts cannot retain a future publication timestamp", () => {
  const now = new Date("2026-08-18T02:15:00.000Z");
  const post = {
    status: "published",
    publishedAt: new Date("2026-08-18T07:00:00.000Z"),
  };

  normalizePublishedAt(post, now);

  assert.equal(post.publishedAt.toISOString(), now.toISOString());
});

test("public post filters retain publication, search, and category clauses", () => {
  const now = new Date("2026-08-18T02:15:00.000Z");
  const filter = publicPostFilter(now);

  appendPublicPostFilterClause(filter, { $or: [{ title: /AI/i }] });
  appendPublicPostFilterClause(filter, { $or: [{ "category.slug": "ai" }] });

  assert.equal(filter.status, "published");
  assert.equal(filter.$and.length, 3);
  assert.deepEqual(filter.$and[0].$or[2], { publishedAt: { $lte: now } });
});

test("super admin category listing no longer references an undefined category", async () => {
  const originalFind = CategoryModel.find;
  const originalCountDocuments = CategoryModel.countDocuments;
  let receivedQuery;

  const query = {
    select() { return this; },
    sort() { return this; },
    skip() { return this; },
    limit() { return Promise.resolve([{ _id: "category-1", name: "news" }]); },
  };

  CategoryModel.find = (filter) => {
    receivedQuery = filter;
    return query;
  };
  CategoryModel.countDocuments = async () => 1;

  try {
    const req = { user: { id: "user-1", role: "super_admin" }, query: {} };
    const res = createResponse();
    await getAllCategories(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.success, true);
    assert.equal(res.payload.pagination.total, 1);
    assert.deepEqual(receivedQuery, {});
  } finally {
    CategoryModel.find = originalFind;
    CategoryModel.countDocuments = originalCountDocuments;
  }
});

test("malformed JSON returns a structured 400 response", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  t.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  const response = await fetch(`http://127.0.0.1:${port}/api/v1/messages`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: '{"message":',
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    message: "Invalid JSON body",
  });
});

test("a JSON null payload is rejected with a structured 400 response", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  t.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  const response = await fetch(`http://127.0.0.1:${port}/api/v1/messages`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "null",
  });

  assert.equal(response.status, 400);
  assert.equal((await response.json()).message, "Invalid JSON body");
});
