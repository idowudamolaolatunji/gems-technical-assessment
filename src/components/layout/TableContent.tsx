import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../stores";
import { clearFilters, fetchPosts, fetchPostsByUserId, selectFilteredPosts, selectPostsLoading, selectSearchQuery, selectUserFilter, setSearchQuery, setUserFilter } from "../../stores/slices/postsSlice";
import { fetchUsers, selectUsers, selectUsersLoading } from "../../stores/slices/usersSlice";
import { PiMagnifyingGlass } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import { TbArrowsSort } from "react-icons/tb";
import DataTable, { type TableColumn, type TableStyles } from 'react-data-table-component';
import { Loader } from "../elements/Loading";
import { CUSTOM_TABLE_STYLES } from "../../utils/constants";
import PostsErrorComponent from "./PostsErrorComponent";


type DataRow = {
	id: string | number;
	userId: number;
	body: string;
	title: string;
};

export default function TableContent() {
    const [searchInput, setSearchInput] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("")
      
    const dispatch = useDispatch<AppDispatch>();

    // POST SELECTORS
    const posts = useSelector((state: RootState) => selectFilteredPosts(state));
    const postsLoading = useSelector((state: RootState) => selectPostsLoading(state));
    const searchQuery = useSelector((state: RootState) => selectSearchQuery(state));
    const userFilter = useSelector((state: RootState) => selectUserFilter(state));
    
    // USERS SELECTORS
    const users = useSelector((state: RootState) => selectUsers(state));
    const usersLoading = useSelector((state: RootState) => selectUsersLoading(state));
    
    // FETCH POSTS AND USERS ON COMPONENT MOUNT
    useEffect(function() {
        dispatch(fetchPosts());
        dispatch(fetchUsers());
    }, [dispatch]);

    // SYNC LOCAL SEARCH WITH REDUX STATE
    useEffect(function() {
        setSearchInput(searchQuery);
    }, [searchQuery]);


    // GET USER NAME BY ID
    const getUserById = (userId: number): string => {
        const foundUser = users.find(u => u.id === userId);
        return foundUser ? foundUser?.name : `User ${userId}`;
    };

    // HANDLE SEARCH INPUT CHANGE
    const handleSearchChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
        const value = e?.target?.value;
        setSearchInput(value || "");
        dispatch(setSearchQuery(value || ""));
    };

    const handleUserFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = e.target.value ? Number(e.target.value) : null;
        setSelectedUserId(String(userId ?? ""))

        if (userId) {
            // Fetch posts for specific user
            dispatch(fetchPostsByUserId(userId));
            dispatch(setUserFilter(userId));
        } else {
            // Fetch all posts
            dispatch(fetchPosts());
            dispatch(setUserFilter(null));
        }
    };

    // HANDLE CLEAR FILTERS
    const handleClearFilters = () => {
        setSearchInput('');
        setSelectedUserId("")
        dispatch(clearFilters());
        dispatch(fetchPosts());
    };

    // table columns for the table data
    const columns: TableColumn<DataRow>[] = [
        {
            name: 'ID',
            selector: (row) => `#${row?.id}`,
            width: "8rem"
        },
        {
            name: 'Title',
            selector: (row) => row?.title,
            width: "25rem"
        },
        {
            name: "Users",
            cell: (row) => (
                <span className="table--user">
                    {getUserById(row?.userId)}
                </span>
            ),
            selector: (row) => row?.userId,
            width: "20rem"
        },
        {
            name: 'Post Body',
            selector: (row) => row?.body,
            minWidth: "30rem"
        },
    ];

    return (
        <div className="content--table">
            <div className="content--top">
                <div className="content--input">
                    <PiMagnifyingGlass />
                    <input type="text" value={searchInput} placeholder="Search" onChange={handleSearchChange} />
                    {searchInput && (
                        <span className="form--input-icon" onClick={() => handleSearchChange()}>
                            <AiOutlineClose />
                        </span>
                    )}
                </div>

                <div className="actions--flex">
                    <button className="action--btn" onClick={() => {}}><TbArrowsSort /> Sort</button>
                    <select className="action--btn" value={selectedUserId} onChange={handleUserFilterChange}>
                        {usersLoading && <option selected hidden>Loading...</option>}
                        <option selected value="">All Users</option>
                        {users && users?.map((user) => (
                            <option value={user?.id} key={user?.id}>{user?.name}</option>
                        ))}
                    </select>
                </div>

                <div className="actions--flex left">
                    {(searchQuery || userFilter) && (
                        <button onClick={handleClearFilters}>
                            Clear Filters
                        </button>
                    )}
                    <span className="content--info">{users?.length} users</span>
                    <span>|</span>
                    <span className="content--info">{posts?.length} posts</span>
                </div>
            </div>

            <div className="table--container">
                <DataTable
                    data={posts}
                    columns={columns}
                    responsive
                    persistTableHead
                    noDataComponent={""}
                    customStyles={CUSTOM_TABLE_STYLES as TableStyles}
                    pointerOnHover={false}
                    selectableRows={false}
                    progressPending={false}
                    highlightOnHover={false}
                />

                {postsLoading && (
                    <div className="table--spinner">
                        <Loader size={30} />
                    </div>
                )}

                <PostsErrorComponent
                    handleClearFilters={handleClearFilters}
                />
            </div>
        </div>
    )
}
