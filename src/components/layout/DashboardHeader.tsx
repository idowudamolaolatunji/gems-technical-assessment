import { useEffect, useState } from "react"
import { RiMenu3Fill, RiSearch2Line  } from "react-icons/ri";
import { GoBell  } from "react-icons/go";
import { GrDown  } from "react-icons/gr";
import avatar from "../../asset/images/avatar.png"
import type { AppDispatch, RootState } from "../../stores";
import { logout, selectUser } from "../../stores/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectSearchQuery, setSearchQuery } from "../../stores/slices/postsSlice";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { HiUser } from "react-icons/hi";
import { IoLogOutOutline } from "react-icons/io5";
import useSidebar from "../../hooks/useSidebar";


export default function DashboardHeader() {
    const [searchInput, setSearchInput] = useState("");
    const [isShownDropdown, setIsShownDropdown] = useState(false);
    const { handleToggleSidemenu, MobileDashboadMenuUI, isShowSidemenu } = useSidebar()

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector((state: RootState) => selectUser(state));
    const searchQuery = useSelector((state: RootState) => selectSearchQuery(state));

    // SYNC LOCAL SEARCH WITH REDUX STATE
    useEffect(() => {
        setSearchInput(searchQuery);
    }, [searchQuery]);

    const handleLogout = function() {
        dispatch(logout());
        navigate('/login');
    };

    const handleToggleDropdown = function () {
        setIsShownDropdown(!isShownDropdown);
    }

    // HANDLE SEARCH INPUT CHANGE
    const handleSearchChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSearchInput(value);
        dispatch(setSearchQuery(value));
    };

    const ref = useOutsideClick(handleToggleDropdown) as React.RefObject<HTMLDivElement>;

    return (
        <header className="dashboard--header">
            <div className="header--logo">
                <button className="hamburger--icon" onClick={handleToggleSidemenu}>
                    <RiMenu3Fill />
                </button>
                <span className="logo">LOGO</span>
            </div>

            <div className="header--input">
                <RiSearch2Line />
                <input type="text" value={searchInput} placeholder="Search" onChange={handleSearchChange} />
            </div>
        
            <div className="header--nav">
                <span className="nav--notification">
                    <GoBell />
                </span>

                <div className='nav--auth' onClick={handleToggleDropdown}>
                    <img src={avatar} alt={"user avatar"} />
                    <GrDown />

                    {isShownDropdown && (
                        <div className="dropdown" ref={ref}>
                            <span className="dropdown--item"><HiUser /> {user?.name}</span>
                            <button className="dropdown--item" onClick={handleLogout}><IoLogOutOutline /> Logout</button>
                        </div>
                    )}
                </div>
            </div>

            {isShowSidemenu && <MobileDashboadMenuUI />}
        </header>
    )
}
