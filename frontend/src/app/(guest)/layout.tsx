import NavbarUser from "@/components/user/NavbarUser";

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <NavbarUser />
            {children}
        </div>
    );
}