'use client';
import Image from "next/image";
import Layout from "@/components/layouts/Layouts";
import { useAuth } from "../authContext";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faLock, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import AlertDialogComponent from "@/components/elements/AlertDialog";
import { useState, useEffect, useRef } from "react";

export default function Account() {
    const router = useRouter();
    const { user } = useAuth();
    const [profilePic, setProfilePic] = useState(null);
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        birth: user?.birth || '',
        JK: user?.JK || '',
        univ: user?.univ || '',
        prodi: user?.prodi || '',
        npm: user?.npm || '',
        number: user?.number || '',
        anakke: user?.anakke || '',
        address: user?.address || ''
    });
    const [initialData, setInitialData] = useState({});

    useEffect(() => {
        if (user) {
            const initialFormData = {
                username: user?.username || '',
                email: user?.email || '',
                birth: user?.birth || '',
                JK: user?.JK || '',
                univ: user?.univ || '',
                prodi: user?.prodi || '',
                npm: user?.npm || '',
                number: user?.number || '',
                anakke: user?.anakke || '',
                address: user?.address || ''
            };
            setFormData(initialFormData);
            setInitialData(initialFormData);
        }
    }, [user]);

    const handleCancel = () => {
        setFormData(initialData);
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
                method: "GET",
                credentials: 'include'
            });

            if (res.ok) {
                console.log("Logout successfully");
                document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                router.push("/");
            } else {
                console.log("Logout not successfully");
            }
        } catch (error) {
            console.log("Logout successfully");
            router.push("/");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFormDataChanged = Object.keys(initialData).some(key => initialData[key] !== formData[key]);

        if (!isFormDataChanged && !profilePic) {
            setMessage("Tidak ada yang diupdate");
            setTimeout(() => {
                setMessage('');
            }, 3000);
            return;
        }

        const newFormData = new FormData();
        Object.keys(formData).forEach(key => {
            newFormData.append(key, formData[key]);
        });
        if (profilePic) {
            newFormData.append('myfiles', profilePic);
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
                method: "POST",
                credentials: 'include',
                body: newFormData,
            });

            if (res.ok) {
                console.log("Update successfully");
                setTimeout(() => {
                    setMessage('Update successful!');
                }, 3000);
            } else {
                console.log("Update not successful");
            }
        } catch (error) {
            console.log("Error updating profile", error);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Layout>
            <div className="w-full min-h-screen flex">
                <div className="w-1/4 bg-white shadow-md p-4">
                    <div className="flex flex-col items-center mb-6">
                        <Image 
                            src={user?.myfiles ? user.myfiles : "/icons/user.png"}
                            alt="Profile image"
                            width={200}
                            height={200}
                            className="rounded-full h-[182px] object-cover cursor-pointer"
                            onClick={handleImageClick}
                        />
                        <input 
                            type="file" 
                            name="myfiles" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange} 
                        />
                        <h2 className="text-lg font-semibold mt-2">{user?.username}</h2>
                        <h4 className="text-lg mt-1">{user?.prodi}</h4>
                    </div>
                    <div className="flex flex-col gap-2">
                        <a href="/account" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                            <FontAwesomeIcon icon={faAddressCard} className="w-5 h-5" />
                            <span>Akun</span>
                        </a>
                        <a href="/password" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                            <FontAwesomeIcon icon={faLock} className="w-5 h-5" />
                            <span>Kata Sandi</span>
                        </a>
                        <AlertDialogComponent 
                                alertDialogAction="Logout" 
                                alertDialogCancel="Cancel"
                                onActionClick={handleLogout}
                                alertDialogTitle="Apakah Anda yakin ingin keluar dari halaman ini?"
                                actionButtonColor="bg-primary-600"
                            >
                            <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer" >
                                <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
                                <span>Logout</span>
                            </div>
                        </AlertDialogComponent>
                    </div>
                </div>
                <div className="w-3/4 bg-white p-6">
                    <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
                    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Nama Lengkap</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} className="p-2 w-[80%] border rounded" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Email</label>
                            <input type="email" name="email" disabled="disable" value={formData.email} className="p-2 w-[80%] border rounded" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Tanggal Lahir</label>
                            <input type="text" name="birth" defaultValue={formData.birth} className="p-2 w-[80%] border rounded" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Jenis Kelamin</label>
                            <input type="text" name="jeniskelamin" disabled="disable" value={formData.JK} onChange={handleChange} className="p-2 w-[80%] border rounded" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Universitas</label>
                            <input type="text" name="univ" value={formData.univ} onChange={handleChange} className="p-2 w-[80%] border rounded" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Program Studi</label>
                            <input type="text" name="prodi" value={formData.prodi} onChange={handleChange} className="p-2 w-[80%] border rounded" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Nomor Pokok Mahasiswa</label>
                            <input type="text" name="npm" value={formData.npm} onChange={handleChange} className="p-2 w-[80%] border rounded" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Nomor Telepon</label>
                            <input type="text" name="number" value={formData.number} onChange={handleChange} className="p-2 w-[80%] border rounded" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Anak ke</label>
                            <input type="text" name="anakke" value={formData.anakke} onChange={handleChange} className="p-2 w-[80%] border rounded" />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="font-semibold mb-1">Alamat</label>
                            <input 
                                type="text" 
                                name="address" 
                                value={formData.address} 
                                onChange={handleChange}
                                className="p-2 border rounded w-full h-10"
                            />
                        </div>
                        <div className="col-span-2 flex justify-end gap-4">
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Update</button>
                            <button type="button" onClick={handleCancel} className="bg-gray-300 py-2 px-4 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
                {message && (
                    <div className={`fixed rounded success-message ${message === 'Update successful!' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                        {message}
                    </div>
                )}
            </div>
        </Layout>
    );
}
