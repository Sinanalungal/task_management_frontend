"use client";
import Breadcrumb from "@/components/breadcump";
import { useParams } from "next/navigation";

const breadcrumbItems = [
  { label: 'Home', href: '/dashboard/' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'Tasks' }
];

const SingleProject = () => {
  const params = useParams();
  const slug = params.slug;

  return (
    <div className="p-6">
      <Breadcrumb items={breadcrumbItems} />
      <div>
        <h1 className="text-2xl font-bold mb-4">Project Details</h1>
        <p className="text-gray-600">Project Slug: {slug}</p>
      </div>
    </div>
  );
};

export default SingleProject;
