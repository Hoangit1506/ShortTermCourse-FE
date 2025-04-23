// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import NotFound from '../pages/NotFound'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../contexts/auth'
import ReceiveTokens from '../pages/auth/ReceiveTokens'
import Categories from '../pages/Categories'
import CourseList from '../pages/CourseList'
import CourseDetail from '../pages/CourseDetail'
import OpenCourses from '../pages/OpenCourses'
import ClassroomDetail from '../pages/ClassroomDetail'
import AdminLayout from '../components/AdminLayout'
import UserLayout from '../components/UserLayout'
import MyCourses from '../pages/user/MyCourses'
import AdminCategories from '../pages/admin/AdminCategories'
import AdminCourses from '../pages/admin/AdminCourses'
import CourseCreate from '../pages/admin/CourseCreate'
import CourseEdit from '../pages/admin/CourseEdit'
import CourseView from '../pages/admin/CourseView'
import AdminLecturers from '../pages/admin/AdminLecturers'
import AdminLecturerCreate from '../pages/admin/AdminLecturerCreate'
import AdminLecturerEdit from '../pages/admin/AdminLecturerEdit'
import AdminLecturerView from '../pages/admin/AdminLecturerView'
import AdminClassrooms from '../pages/admin/AdminClassrooms'
import AdminClassroomCreate from '../pages/admin/AdminClassroomCreate'
import AdminClassroomEdit from '../pages/admin/AdminClassroomEdit'
import AdminClassroomView from '../pages/admin/AdminClassroomView'


function Protected({ children, roles }) {
    const { user } = useAuth();
    console.log('Protected', user, roles);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Kiểm tra nếu user không có bất kỳ quyền nào trong `roles`
    if (roles && !roles.some(role => user.roles.includes(role))) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Homepage, không cần layout auth */}
                <Route path="/" element={<HomePage />} />

                <Route path="/auth/receive-tokens" element={<ReceiveTokens />} />

                {/* Tất cả route auth sẽ dùng chung AuthLayout */}
                <Route element={<AuthLayoutWrapper />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

                <Route path="/categories" element={<Categories />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/open-course" element={<OpenCourses />} />
                <Route path="/classrooms/:id" element={<ClassroomDetail />} />

                <Route path="*" element={<NotFound />} />

                <Route
                    path="/user"
                    element={
                        <Protected roles={['USER']}>
                            <UserLayout />
                        </Protected>
                    }
                >
                    <Route path="my-courses" element={<MyCourses />} />
                </Route>


                {/* Admin routes */}
                <Route
                    path="/admin"
                    element={
                        <Protected roles={['ADMIN']}>
                            <AdminLayout />
                        </Protected>
                    }
                >
                    <Route path="categories" element={<AdminCategories />} />

                    <Route path="courses" element={<AdminCourses />} />
                    <Route path="courses/create" element={<CourseCreate />} />
                    <Route path="courses/edit/:id" element={<CourseEdit />} />
                    <Route path="courses/:id" element={<CourseView />} />

                    <Route path="lecturers" element={<AdminLecturers />} />
                    <Route path="lecturers/create" element={<AdminLecturerCreate />} />
                    <Route path="lecturers/edit/:id" element={<AdminLecturerEdit />} />
                    <Route path="lecturers/:id" element={<AdminLecturerView />} />

                    <Route path="classrooms" element={<AdminClassrooms />} />
                    <Route path="classrooms/create" element={<AdminClassroomCreate />} />
                    <Route path="classrooms/edit/:id" element={<AdminClassroomEdit />} />
                    <Route path="classrooms/:id" element={<AdminClassroomView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

function AuthLayoutWrapper() {
    return <AuthLayout><Outlet /></AuthLayout>
}
