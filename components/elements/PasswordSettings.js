'use client';
import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/app/authContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Layout from "@/components/layouts/Layouts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faLock, faShieldAlt, faBell, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import AlertDialogComponent from "@/components/elements/AlertDialog";

export default function PasswordSettings() {
    const router = useRouter();
    const { user } = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleLogout = async () => {
        try {
            const res = await fetch("http://13.212.181.136:5001/logout", {
                method: "GET",
                credentials: 'include'
            });

            if (res.ok) {
                console.log("Logout successfully");
                router.push("/");
            } else {
                console.log("Logout not successfully");
            }
        } catch (error) {
            console.log("Logout successfully");
            router.push("/");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        try {
            const res = await fetch("http://13.212.181.136:5001/api/change_password", {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });

            if (res.ok) {
                console.log("Password updated successfully");
                alert("Password updated successfully");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                console.log("Password update failed");
                alert("Password update failed");
            }
        } catch (error) {
            console.error("Error updating password", error);
        }
    };

    return (
        <Layout>
            <div className="w-full min-h-screen flex">
                {/* Sidebar */}
                <div className="w-1/4 bg-white shadow-md p-4">
                    <div className="flex flex-col items-center mb-6">
                        <Image 
                            src={user?.myfiles ? user.myfiles : "/icons/user.png"}
                            alt="Profile image"
                            width={200}
                            height={200}
                            className="rounded-full h-[182px] object-cover"
                        />
                        <h2 className="text-lg font-semibold mt-2">{user?.username}</h2>
                        <h4 className="text-lg mt-1">{user?.prodi}</h4>
                    </div>
                    <div className="flex flex-col gap-2">
                        <a href="/account" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                            <FontAwesomeIcon icon={faAddressCard} className="w-5 h-5" />
                            <span>Akun</span>
                        </a>
                        <a href="/password" className="flex items-center gap-2 p-2 rounded bg-gray-100">
                            <FontAwesomeIcon icon={faLock} className="w-5 h-5" />
                            <span>Kata Sandi</span>
                        </a>
                        <AlertDialogComponent 
                                alertDialogAction="Logout" 
                                alertDialogCancel="Cancel"
                                onActionClick={handleLogout}
                                alertDialogTitle="Apakah Anda yakin ingin keluar dari halaman ini?"
                                actionButtonColor="bg-danger"
                            >
                            <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer" >
                                <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
                                <span>Logout</span>
                            </div>
                        </AlertDialogComponent>
                    </div>
                </div>
                {/* Main Content */}
                <div className="w-3/4 bg-white p-6">
                    <h1 className="text-2xl font-bold mb-4">Password Settings</h1>
                    <form className="grid grid-cols-2 gap-4" onSubmit={handlePasswordChange}>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Kata Sandi lama</label>
                            <input 
                                type="password" 
                                value={oldPassword} 
                                onChange={(e) => setOldPassword(e.target.value)} 
                                className="p-2 w-[80%] border rounded" 
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Kata Sandi Baru</label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                className="p-2 w-[80%] border rounded" 
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Konfirmasi Kata Sandi</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                className="p-2 w-[80%] border rounded" 
                            />
                        </div>
                        <div className="col-span-2 flex justify-end gap-4">
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Update</button>
                            <button type="button" className="bg-gray-300 py-2 px-4 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
