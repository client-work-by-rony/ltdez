import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import UsersPage from "@/pages/admin/UsersPage";
import EnrollmentsPage from "@/pages/admin/EnrollmentsPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import PaymentsPage from "@/pages/admin/PaymentsPage";
import CoursesManagePage from "@/pages/admin/CoursesManagePage";
import LessonsManagePage from "@/pages/admin/LessonsManagePage";
import AssignmentsManagePage from "@/pages/admin/AssignmentsManagePage";
import SubmissionsPage from "@/pages/admin/SubmissionsPage";
import VideoTrackingPage from "@/pages/admin/VideoTrackingPage";
import HeroSlidesPage from "@/pages/admin/HeroSlidesPage";
import ImageManagerPage from "@/pages/admin/ImageManagerPage";
import SiteDataPage from "@/pages/admin/SiteDataPage";
import ReviewsManagePage from "@/pages/admin/ReviewsManagePage";
import { UserDashboardLayout } from "@/components/dashboard/UserDashboardLayout";
import UserDashboard from "@/pages/dashboard/UserDashboard";
import CoursesPage from "@/pages/dashboard/CoursesPage";
import CourseDetailPage from "@/pages/dashboard/CourseDetailPage";
import AssignmentsPage from "@/pages/dashboard/AssignmentsPage";
import ResourcesPage from "@/pages/dashboard/ResourcesPage";
import CommunityPage from "@/pages/dashboard/CommunityPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";
import DailyTrackerPage from "@/pages/DailyTrackerPage";
import SelfReflectionPage from "@/pages/SelfReflectionPage";
import SelfAccountabilityPage from "@/pages/SelfAccountabilityPage";
import CourseDetailPublic from "@/pages/CourseDetailPublic";
import Promo from "@/pages/Promo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/courses/:slug" element={<CourseDetailPublic />} />
            <Route path="/promo" element={<Promo />} />
            <Route path="/dashboard" element={<UserDashboardLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:courseId" element={<CourseDetailPage />} />
              <Route path="assignments" element={<AssignmentsPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="enrollments" element={<EnrollmentsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="courses" element={<CoursesManagePage />} />
              <Route path="courses/:courseId/lessons" element={<LessonsManagePage />} />
              <Route path="lessons/:lessonId/assignments" element={<AssignmentsManagePage />} />
              <Route path="assignments/:assignmentId/submissions" element={<SubmissionsPage />} />
              <Route path="video-tracking" element={<VideoTrackingPage />} />
              <Route path="hero-slides" element={<HeroSlidesPage />} />
              <Route path="images" element={<ImageManagerPage />} />
              <Route path="site-data" element={<SiteDataPage />} />
              <Route path="reviews" element={<ReviewsManagePage />} />
            </Route>
            <Route path="/daily-tracker" element={<DailyTrackerPage />} />
            <Route path="/self-reflection" element={<SelfReflectionPage />} />
            <Route path="/self-accountability" element={<SelfAccountabilityPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
