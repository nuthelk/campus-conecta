import { getPosts } from "@/api/getPosts";
import { useEffect, useState } from "react";
import ComponentPost from "./components/ComponentPost";
import PostModal from "./components/PostModal";
import type { Post } from "@/types/Post";

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPosts();
      setPosts(posts);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <main className="m-auto flex justify-center  p-8 h-full">
        <section className="pb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1a1b4b] mb-8">
            Publicaciones recientes
          </h1>
          <div className="pb-20">
            {posts.map((post) => (
              <ComponentPost
                key={post.id}
                post={post}
                onOpenModal={() => setSelectedPost(post)}
              />
            ))}
          </div>
        </section>
      </main>
      {selectedPost && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      )}

      {/* Modal at root level */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
};

export default Posts;
