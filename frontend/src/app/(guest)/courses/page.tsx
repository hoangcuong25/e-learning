import { Metadata } from "next";
import CoursesClient from "./Courses";

export const metadata: Metadata = {
  title: "Danh sách khóa học | EduSmart",
  description:
    "Khám phá hàng trăm khóa học trực tuyến chất lượng cao tại EduSmart. Học lập trình, thiết kế, kinh doanh, marketing và nhiều lĩnh vực khác.",
  openGraph: {
    title: "Danh sách khóa học | EduSmart",
    description:
      "Học mọi lúc, mọi nơi với hàng trăm khóa học hấp dẫn trên EduSmart.",
    url: "https://edusmart.vn/courses",
    siteName: "EduSmart",
    images: [
      {
        url: "/elearning-banner.png",
        width: 1200,
        height: 630,
        alt: "EduSmart Courses Banner",
      },
    ],
  },
};

// Hàm SSR
export default async function CoursesPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search || "";
  const sortBy = params.sortBy || "createdAt";
  const order = params.order || "desc";

  // 🚀 Fetch dữ liệu trên server
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}course?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&order=${order}`,
    { cache: "no-store" } // SSR fresh data
  );

  const data = await res.json();

  return (
    <CoursesClient
      initialCourses={data.data.data}
      totalPages={data.data.pagination.totalPages}
      initialParams={{ page, limit, search, sortBy, order }}
    />
  );
}
