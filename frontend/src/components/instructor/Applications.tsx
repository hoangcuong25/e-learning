import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  approveInstructor,
  fetchAllApplications,
  rejectInstructor,
} from "@/store/instructorSlice";

interface ApplicationsProps {
  applications: InstructorApplicationType[];
}

const Applications: React.FC<ApplicationsProps> = ({ applications }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleApproveApp = async (userId: number, applicationId: number) => {
    try {
      await dispatch(approveInstructor({ userId, applicationId })).unwrap();
      await dispatch(fetchAllApplications()).unwrap();

      toast.success("Đơn đã được chấp thuận thành công!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Lỗi khi phê duyệt đơn đăng ký"
      );
    }
  };

  const handleRejectApp = async (userId: number, applicationId: number) => {
    try {
      await dispatch(rejectInstructor({ userId, applicationId })).unwrap();
      await dispatch(fetchAllApplications()).unwrap();

      toast.success("Đơn đã bị từ chối thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi từ chối đơn đăng ký");
    }
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-6">
        Không có đơn ứng tuyển nào.
      </div>
    );
  }

  return (
    <section className="mt-6 grid md:grid-cols-2 gap-6">
      {applications.map((app) => (
        <Card
          key={app.id}
          className="rounded-2xl border border-indigo-100 shadow-sm"
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  {app.user?.fullname}
                </div>
                <div className="text-sm text-gray-500">{app.user?.email}</div>
              </div>
              {new Date(app.createdAt).toLocaleString("vi-VN", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Kinh nghiệm:</strong> {app.experience}
            </p>
            <p>
              <strong>Giới thiệu:</strong> {app.bio}
            </p>
            <p>
              <strong>Chuyên ngành:</strong>{" "}
              {app.applicationSpecializations
                ?.map((item) => item.specialization.name)
                .join(", ") || "Không có"}
            </p>

            <div className="flex items-center justify-between pt-2">
              <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md">
                {app.status}
              </Badge>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (app.user?.id !== undefined) {
                      handleApproveApp(app.user.id, app.id);
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  disabled={app.user?.id === undefined}
                >
                  <Check className="w-4 h-4" /> Duyệt
                </Button>
                <Button
                  onClick={() => {
                    if (app.user?.id !== undefined) {
                      handleRejectApp(app.user.id, app.id);
                    }
                  }}
                  variant="destructive"
                  className="flex items-center gap-2"
                  disabled={app.user?.id === undefined}
                >
                  <X className="w-4 h-4" /> Từ chối
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default Applications;
