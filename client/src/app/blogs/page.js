"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function BlogList() {
  const [drafts, setDrafts] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://blog-editor-liev.onrender.com/api/blogs"
      );
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      setDrafts(data.filter((b) => b.status === "draft"));
      setPublished(data.filter((b) => b.status === "published"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePublish = async (id) => {
    try {
      setLoading(true);
      console.log(id);
      const res = await fetch(
        `https://blog-editor-liev.onrender.com/api/blogsUpdate/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("Publish failed");
      await fetchBlogs();
      Swal.fire({
        title: "Your blog is now public.",
        icon: "success",
        draggable: true,
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      setLoading(true);
      const res = await fetch(
        `https://blog-editor-liev.onrender.com/api/blogs/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      await fetchBlogs();
      Swal.fire({
        title: "Deleted!",
        text: "Blog has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = [...drafts, ...published]
    .flatMap((blog) => blog.tags.split(",").map((tag) => tag.trim()))
    .filter((value, index, self) => self.indexOf(value) === index);

  const filteredPublished =
    selectedTag === "All"
      ? published
      : published.filter((blog) =>
          blog.tags.toLowerCase().includes(selectedTag.toLowerCase())
        );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow-md">
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📝 All Blogs
        </h1>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out hover:scale-105"
        >
          + Add Blogs
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {loading && <p className="text-blue-500 mb-4">Loading...</p>}

      <div className="overflow-x-auto mb-6 flex gap-2 pb-2">
        <button
          onClick={() => setSelectedTag("All")}
          className={`px-4 py-2 border rounded-full whitespace-nowrap ${
            selectedTag === "All"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 border rounded-full whitespace-nowrap capitalize ${
              selectedTag === tag
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-green-700">
          Published Blogs
        </h2>
        {filteredPublished?.length === 0 && (
          <p className="text-gray-500">
            No published blogs found for this tag.
          </p>
        )}
        <ul>
          {filteredPublished?.map((blog) => (
            <li
              key={blog?._id}
              className="relative border border-green-300 p-4 mb-4 rounded-md hover:shadow-lg bg-green-50 group"
            >
              <h3 className="font-bold text-lg text-green-900">
                {blog?.title}
              </h3>
              <p className="text-gray-700 mt-1">
                {blog?.content.slice(0, 120)}...
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {blog?.tags.split(",").map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-green-200 text-green-800 rounded"
                  >
                    {tag?.trim()}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleDelete(blog._id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete this blog"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-yellow-700">
          Draft Blogs
        </h2>
        {drafts.length === 0 && (
          <p className="text-gray-500">No drafts available.</p>
        )}
        <ul>
          {drafts.map((blog) => (
            <li
              key={blog._id}
              className="border border-yellow-300 p-4 mb-4 rounded-md bg-yellow-50 flex justify-between items-start hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="font-bold text-lg text-yellow-900">
                  {blog.title}
                </h3>
                <p className="text-gray-700 mt-1">
                  {blog.content.slice(0, 120)}...
                </p>
              </div>
              <button
                onClick={() => handlePublish(blog._id)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition-colors"
                title="Publish this draft"
              >
                Publish
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
