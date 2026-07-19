import CreateArticle from "@/components/Blogs/AddBlog/CreatePost";
import Frame from "@/components/Frame/Frame";
import React from "react";

const EditPost = async ({ params }) => {
  const { id } = await params;

  return (
    <Frame>
      <CreateArticle mode="edit" postId={id} />
    </Frame>
  );
};

export default EditPost;
