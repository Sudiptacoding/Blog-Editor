"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isUserSaved, setIsUserSaved] = useState(false);
  const typingTimeoutRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isUserSaved) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      handleSaveDraft();
    }, 5000);
    return () => clearTimeout(typingTimeoutRef.current);
  }, [title, content, tags, isUserSaved]);

  const handleSaveDraft = async () => {
    if (!title && !content) return;
    const res = await fetch(
      "https://blog-editor-liev.onrender.com/api/blogs/savedraft",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags, status: "draft" }),
      }
    );

    if (res.ok) {
      toast.success("Successfully Auto-saved ✔");
      setTitle("");
      setContent("");
      setTags("");
    }
  };

  const handleSaveDraftClick = async () => {
    await handleSaveDraft();
    setIsUserSaved(true);
  };

  const handlePublish = async () => {
    if (!title && !content) {
      toast.error("Please add Blog");
      return;
    }
    const res = await fetch(
      "https://blog-editor-liev.onrender.com/api/blogs/publish",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags, status: "published" }),
      }
    );
    if (res.ok) {
      setIsUserSaved(true);
      Swal.fire({
        title: "Published successfully",
        icon: "success",
        draggable: true,
      });
      setTitle("");
      setContent("");
      setTags("");
    }
  };

  const handleFocus = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        handleSaveDraft();
      }, 30000);
    }
  };

  const handleBlur = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📝 Blog Editor
        </h1>
        <Link
          href="/blogs"
          className="inline-flex items-center px-5 py-2.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out hover:scale-105"
        >
          All Blogs
        </Link>
      </div>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border mb-4 rounded"
        value={title}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => {
          setTitle(e.target.value);
          if (isUserSaved) setIsUserSaved(false);
        }}
      />
      <textarea
        placeholder="Content"
        className="w-full h-60 p-2 border mb-4 rounded"
        value={content}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => {
          setContent(e.target.value);
          if (isUserSaved) setIsUserSaved(false);
        }}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        className="w-full p-2 border mb-4 rounded"
        value={tags}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => {
          setTags(e.target.value);
          if (isUserSaved) setIsUserSaved(false);
        }}
      />
      <div className="flex gap-4">
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={handleSaveDraftClick}
        >
          Save Draft
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handlePublish}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
