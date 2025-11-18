import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../stores";
import { clearFilters, fetchPosts, fetchPostsByUserId, selectFilteredPosts, selectPostsLoading, selectSearchQuery, selectUserFilter, setSearchQuery, setUserFilter } from "../../stores/slices/postsSlice";
import { fetchUsers, selectUsers, selectUsersLoading } from "../../stores/slices/usersSlice";
import React from 'react';
import { AppLoader } from "../elements/Loading";
import { TbArrowsSort } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import { PiMagnifyingGlass } from "react-icons/pi";
import PostsErrorComponent from "./PostsErrorComponent";

export default function MainContent() {
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
            // FETCH ALL POST FOR THE SPECIFIC USER ID
            dispatch(fetchPostsByUserId(userId));
            dispatch(setUserFilter(userId));
        } else {
            // FETCH ALL POST
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


    return (
        <React.Fragment>
            {/* CONTENT TOP ACTIONS */} 
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
                    <span className="content--info">{posts?.length} results</span>
                </div>
            </div>

            {/* WHEN LOADING OR POST NOT EMPTY */}
            {(postsLoading && posts?.length < 1) ? (
                <AppLoader />
            ) : (
                <div className="content--grid">
                    {posts?.map((post) => (
                        <div className="content--card" key={post?.id}>
                            <div className="user--top">
                                <span className="initials">
                                    {getUserById(post?.userId).split(" ")[0].charAt(0)}
                                    {getUserById(post?.userId).split(" ")[1].charAt(0)}
                                </span>
                                <div>
                                    <p className="name">{getUserById(post?.userId)}</p>
                                    <p className="user-id">User ID: {post.userId}</p>
                                </div>
                            </div>
                            <h5 className="title">{post?.title}</h5>
                            <p className="body">{post?.body}</p>
                        </div>
                    ))}
                </div>
            )}

            <PostsErrorComponent
                handleClearFilters={handleClearFilters}
            />
        </React.Fragment>
    )
}
