import { Metadata } from "next";
import CourseDetail from "./CourseDetail";

interface Props {
  params: Promise<{ courseId: string }>;
}

// Hàm generateMetadata (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; // Phải await trước
  const courseId = resolvedParams.courseId;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}course/${courseId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {
      title: "Khóa học không tồn tại | Học Lập Trình",
      description: "Không tìm thấy thông tin khóa học.",
    };
  }

  const data = await res.json();
  const course = data.data;

  return {
    title: `${course.title} | Học Lập Trình`,
    description:
      course.description?.slice(0, 150) ||
      "Khóa học lập trình trực tuyến chất lượng cao.",
    openGraph: {
      title: course.title,
      description: course.description,
      images: [
        {
          url: course.thumbnail || "/images/default-course.jpg",
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
      type: "article",
    },
  };
}

// 🧠 Server Component (SSR)
export default async function CourseDetailPage({ params }: Props) {
  const resolvedParams = await params; // Phải await
  const courseId = resolvedParams.courseId;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}course/${courseId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Không tìm thấy khóa học.
      </div>
    );
  }

  const data = await res.json();
  const course = data.data;

  return <CourseDetail initialCourse={course} />;
}
