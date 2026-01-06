import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Menu, X, Layers, User, LogOut, LayoutDashboard, PlusCircle, Shield, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                <Layers size={20} />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                                CityFix
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden sm:ml-12 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors border-b-2 ${isActive('/')
                                        ? 'border-primary text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
                                    }`}
                            >
                                Home
                            </Link>

                            {user?.role === 'citizen' && (
                                <>
                                    <Link
                                        to="/citizen/dashboard"
                                        className={`inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium transition-colors border-b-2 ${isActive('/citizen/dashboard')
                                                ? 'border-primary text-gray-900'
                                                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
                                            }`}
                                    >
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/complaints/new"
                                        className={`inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium transition-colors border-b-2 ${isActive('/complaints/new')
                                                ? 'border-primary text-gray-900'
                                                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
                                            }`}
                                    >
                                        <PlusCircle size={16} />
                                        File Complaint
                                    </Link>
                                </>
                            )}

                            {user?.role === 'officer' && (
                                <Link
                                    to="/dept/dashboard"
                                    className={`inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium transition-colors border-b-2 ${isActive('/dept/dashboard')
                                            ? 'border-primary text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
                                        }`}
                                >
                                    <Shield size={16} />
                                    Officer Panel
                                </Link>
                            )}

                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin/dashboard"
                                    className={`inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium transition-colors border-b-2 ${isActive('/admin/dashboard')
                                            ? 'border-primary text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
                                        }`}
                                >
                                    <ShieldCheck size={16} />
                                    Admin Control
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-700 leading-none">{user.name}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{user.role}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-destructive hover:bg-destructive/10 transition-colors">
                                    <LogOut size={16} />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm" className="font-medium text-gray-600 hover:text-primary hover:bg-primary/5">Sign In</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm" className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl absolute w-full shadow-lg">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                            Home
                        </Link>
                        {user?.role === 'citizen' && (
                            <>
                                <Link
                                    to="/citizen/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/complaints/new"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
                                >
                                    File Complaint
                                </Link>
                            </>
                        )}
                        {/* Add other role links similarly if needed for mobile */}

                        <div className="pt-4 mt-4 border-t border-gray-100">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                                        </div>
                                    </div>
                                    <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full justify-start mt-2">
                                        <LogOut size={16} className="mr-2" /> Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 pb-2">
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full justify-center">Sign In</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full justify-center">Register</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
