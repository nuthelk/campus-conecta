import { getPosts } from "@/api/getPosts";
import { useEffect, useState } from "react";
import ComponentPost from "./components/ComponentPost";
import type { Post } from "@/types/Post";

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPosts();
      setPosts(posts);
    };
    fetchPosts();
  }, []);
  console.log("posts", posts);
  return (
    <main className=" p-8 h-full">
      <section className="pb-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#1a1b4b] mb-8">
          Publicaciones recientes
        </h1>
        <div>
          {posts.map((post) => (
            <ComponentPost key={post.id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Posts;
