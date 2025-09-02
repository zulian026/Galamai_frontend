import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, ChevronRight } from "lucide-react";
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isBeritaDropdownOpen, setIsBeritaDropdownOpen] = useState(false);
  const [isBeritaDropdownVisible, setIsBeritaDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMobileBeritaDropdownOpen, setIsMobileBeritaDropdownOpen] =
    useState(false);
  const dropdownRef = useRef(null);
  const beritaDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    // Close dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
      if (
        beritaDropdownRef.current &&
        !beritaDropdownRef.current.contains(event.target)
      ) {
        closeBeritaDropdown();
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openDropdown = () => {
    setIsDropdownOpen(true);
    setTimeout(() => setIsDropdownVisible(true), 10);
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
    setTimeout(() => setIsDropdownOpen(false), 300);
  };

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const openBeritaDropdown = () => {
    setIsBeritaDropdownOpen(true);
    setTimeout(() => setIsBeritaDropdownVisible(true), 10);
  };

  const closeBeritaDropdown = () => {
    setIsBeritaDropdownVisible(false);
    setTimeout(() => setIsBeritaDropdownOpen(false), 300);
  };

  const toggleBeritaDropdown = () => {
    if (isBeritaDropdownOpen) {
      closeBeritaDropdown();
    } else {
      openBeritaDropdown();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileDropdownOpen(false);
    setIsMobileBeritaDropdownOpen(false);
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  const toggleMobileBeritaDropdown = () => {
    setIsMobileBeritaDropdownOpen(!isMobileBeritaDropdownOpen);
  };

  const menuItems = [
    { name: "BERANDA", path: "/" },
    { name: "PROFIL", path: "/profil" },
    {
      name: "LAYANAN",
      dropdown: [
        { name: "Tabel Biaya Uji", path: "/layanan/biaya-uji" },
        { name: "Pengaduan Masyarakat", path: "/layanan/pengaduan" },
        { name: "Whistle Blowing", path: "/layanan/whistle-blowing" },
        { name: "Layanan Pertanyaan", path: "/layanan/pertanyaan" },
      ],
    },
    {
      name: "BERITA",
      dropdown: [
        { name: "Berita dan Event", path: "/berita/berita-event" },
        { name: "Artikel", path: "/berita/artikel" },
      ],
    },
    { name: "FAQ", path: "/faq" },
    { name: "KONTAK", path: "/kontak" },
  ];

  useEffect(() => {
    closeDropdown();
    closeBeritaDropdown();
    setIsMobileMenuOpen(false);
    setIsMobileDropdownOpen(false);
    setIsMobileBeritaDropdownOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Animated Background Bar */}
      <div
        className={`
          fixed top-0 left-0 w-full z-20 
          bg-header shadow-lg border-b border-gray-200
          transform transition-all duration-500 ease-out
          ${
            isScrolled
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }
        `}
        style={{ height: "70px" }}
      >
        {/* Background Logo in Scrolled State */}
        {/* <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-white rounded-full p-1 shadow-sm border">
              <img
                src={logo}
                alt="Logo BPOM"
                className="h-7 w-7 md:h-8 md:w-8 object-contain"
              />
            </div>
            <div className="w-[1px] h-6 md:h-7 bg-gray-300"></div>
            <div className="text-white">
              <h1 className="font-semibold leading-tight text-sm md:text-base">
                BALAI POM DI PADANG
              </h1>
              <p className="text-xs text-white hidden sm:block">
                Republik Indonesia
              </p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Logo Section */}
      <div className="fixed top-0 left-0 z-20">
        <div className="py-3 pl-4 md:pl-5">
          <div
            className={`
              flex items-center gap-2.5 
              transform transition-all duration-700 ease-out
              
            `}
          >
            <div className="bg-white rounded-full p-1 shadow-md">
              <img
                src={logo}
                alt="Logo BPOM"
                className="h-7 w-7 md:h-9 md:w-9 object-contain"
              />
            </div>
            <div className="w-[1px] h-6 md:h-7 bg-white"></div>
            <div className="text-white">
              <h1 className="font-semibold leading-tight text-sm md:text-base">
                BALAI BESAR POM DI PADANG
              </h1>
              <p className="text-xs hidden sm:block">Republik Indonesia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="fixed top-0 right-0 z-40 lg:hidden">
        <div className="py-3 pr-4">
          <button
            onClick={toggleMobileMenu}
            className={`
              bg-white border border-gray-300 p-2.5 rounded-lg shadow-lg
              transform transition-all duration-700 ease-out delay-300
              ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }
              ${isScrolled ? "bg-white/95 backdrop-blur-sm" : ""}
            `}
          >
            {isMobileMenuOpen ? (
              <X size={19} className="text-gray-700" />
            ) : (
              <Menu size={19} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <nav
        className={`
          ${isScrolled ? "fixed" : "absolute"} 
          top-0 right-0 z-30 hidden lg:block
        `}
      >
        <div className="py-5 pr-4">
          <div
            className={`
              flex items-center
              ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }
              transition-transform duration-700 ease-out delay-300
            `}
          >
            <ul className="flex items-center gap-6 xl:gap-8">
              {menuItems.map((item) =>
                item.dropdown ? (
                  <li
                    key={item.name}
                    className="relative"
                    ref={
                      item.name === "LAYANAN" ? dropdownRef : beritaDropdownRef
                    }
                  >
                    <button
                      onClick={
                        item.name === "LAYANAN"
                          ? toggleDropdown
                          : toggleBeritaDropdown
                      }
                      className={`
                        flex items-center gap-1.5 text-base xl:text-sm font-bold cursor-pointer 
                        transition-all duration-200 ease-in-out px-3 py-2 rounded-md whitespace-nowrap
                        ${
                          isScrolled
                            ? "text-white hover:text-green-400"
                            : "text-white hover:text-green-400"
                        }
                        ${
                          (item.name === "LAYANAN" &&
                            location.pathname.startsWith("/layanan")) ||
                          (item.name === "BERITA" &&
                            location.pathname.startsWith("/berita"))
                            ? isScrolled
                              ? "text-blue-600"
                              : "text-blue-200"
                            : ""
                        }
                      `}
                    >
                      {item.name}
                      <ChevronDown
                        size={18}
                        className={`
                          transition-all duration-300 ease-in-out
                          ${
                            (item.name === "LAYANAN" && isDropdownOpen) ||
                            (item.name === "BERITA" && isBeritaDropdownOpen)
                              ? "rotate-180"
                              : ""
                          }
                        `}
                      />
                    </button>

                    {((item.name === "LAYANAN" && isDropdownOpen) ||
                      (item.name === "BERITA" && isBeritaDropdownOpen)) && (
                      <div className="absolute top-full left-0 mt-1.5 w-60 z-50">
                        <ul
                          className={`
                            bg-white border border-gray-200 shadow-xl rounded-lg 
                            overflow-hidden backdrop-blur-sm
                            transform transition-all duration-300 ease-out origin-top
                            ${
                              (item.name === "LAYANAN" && isDropdownVisible) ||
                              (item.name === "BERITA" &&
                                isBeritaDropdownVisible)
                                ? "opacity-100 scale-y-100 translate-y-0"
                                : "opacity-0 scale-y-95 -translate-y-2"
                            }
                          `}
                        >
                          {item.dropdown.map((sub, index) => (
                            <li key={sub.name}>
                              <Link
                                to={sub.path}
                                className={`
                                  block px-4 py-2.5 text-sm font-normal text-gray-700
                                  hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100
                                  hover:text-green-500 border-b border-gray-100 last:border-b-0
                                  transition-all duration-200 ease-in-out
                                  transform hover:translate-x-1
                                  ${
                                    location.pathname === sub.path
                                      ? "bg-blue-50 text-header border-l-4 border-l-header"
                                      : ""
                                  }
                                `}
                                style={{
                                  transitionDelay:
                                    (item.name === "LAYANAN" &&
                                      isDropdownVisible) ||
                                    (item.name === "BERITA" &&
                                      isBeritaDropdownVisible)
                                      ? `${index * 50}ms`
                                      : "0ms",
                                }}
                              >
                                <span className="flex items-center justify-between">
                                  {sub.name}
                                  <span className="w-0 h-0.5 bg-header transition-all duration-300 group-hover:w-4"></span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`
                        text-base xl:text-sm font-bold cursor-pointer transition-all duration-200 
                        ease-in-out px-3 py-2 rounded-md whitespace-nowrap
                        ${
                          isScrolled
                            ? "text-white hover:text-green-400"
                            : "text-white hover:text-green-400"
                        }
                        ${
                          location.pathname === item.path
                            ? isScrolled
                              ? "text-blue-600"
                              : "text-blue-200"
                            : ""
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              )}
            </ul>
            {/* <div className="flex items-center gap-1.5 ml-8">
              <span className="text-base xl:text-sm font-bold text-white cursor-pointer hover:text-blue-200 transition-all duration-200 whitespace-nowrap">
                SUBSITE BBPOM
              </span>
              <ChevronRight size={18} className="text-white ml-1" />
            </div> */}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Mobile Menu Content */}
          <div
            ref={mobileMenuRef}
            className={`
              absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl
              transform transition-transform duration-300 ease-out
              ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
            `}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 rounded-full p-1">
                  <img
                    src={logo}
                    alt="Logo BPOM"
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm">
                    BALAI POM
                  </h2>
                  <p className="text-xs text-gray-600">DI PADANG</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={18} className="text-gray-700" />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 overflow-y-auto py-2">
              <ul className="space-y-0.5">
                {menuItems.map((item) =>
                  item.dropdown ? (
                    <li key={item.name}>
                      <button
                        onClick={
                          item.name === "LAYANAN"
                            ? toggleMobileDropdown
                            : toggleMobileBeritaDropdown
                        }
                        className={`
                          w-full flex items-center justify-between px-4 py-3 text-left
                          font-semibold transition-all duration-200 text-base
                          ${
                            (item.name === "LAYANAN" &&
                              location.pathname.startsWith("/layanan")) ||
                            (item.name === "BERITA" &&
                              location.pathname.startsWith("/berita"))
                              ? "text-header bg-blue-50 border-r-4 border-r-header"
                              : "text-gray-700 hover:bg-gray-50 hover:text-header"
                          }
                        `}
                      >
                        {item.name}
                        <ChevronDown
                          size={16}
                          className={`
                            transition-transform duration-300
                            ${
                              (item.name === "LAYANAN" &&
                                isMobileDropdownOpen) ||
                              (item.name === "BERITA" &&
                                isMobileBeritaDropdownOpen)
                                ? "rotate-180"
                                : ""
                            }
                          `}
                        />
                      </button>

                      {/* Mobile Dropdown */}
                      <div
                        className={`
                          overflow-hidden transition-all duration-300 ease-out
                          ${
                            (item.name === "LAYANAN" && isMobileDropdownOpen) ||
                            (item.name === "BERITA" &&
                              isMobileBeritaDropdownOpen)
                              ? "max-h-64 opacity-100"
                              : "max-h-0 opacity-0"
                          }
                        `}
                      >
                        <ul className="bg-gray-50 border-l-4 border-l-gray-200">
                          {item.dropdown.map((sub, index) => (
                            <li key={sub.name}>
                              <Link
                                to={sub.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                  block px-8 py-2.5 text-sm font-medium
                                  transition-all duration-200
                                  ${
                                    location.pathname === sub.path
                                      ? "text-header bg-blue-100 border-r-4 border-r-header"
                                      : "text-gray-600 hover:bg-white hover:text-header"
                                  }
                                `}
                                style={{
                                  transitionDelay:
                                    (item.name === "LAYANAN" &&
                                      isMobileDropdownOpen) ||
                                    (item.name === "BERITA" &&
                                      isMobileBeritaDropdownOpen)
                                      ? `${index * 30}ms`
                                      : "0ms",
                                }}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ) : (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          block px-4 py-3 font-semibold transition-all duration-200 text-base
                          ${
                            location.pathname === item.path
                              ? "text-header bg-blue-50 border-r-4 border-r-header"
                              : "text-gray-700 hover:bg-gray-50 hover:text-header"
                          }
                        `}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Mobile Menu Footer */}
            <div className="border-t border-gray-200 p-4">
              <div className="bg-header rounded-lg px-3 py-2 text-center">
                <span className="text-sm font-semibold text-white">
                  SUBSITE BBPOM
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
