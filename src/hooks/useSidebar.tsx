import React, { useState } from 'react'
import Overlay from '../components/layout/Overlay';
import { RiCloseFill } from 'react-icons/ri';
import { LuSquarePlus } from 'react-icons/lu';
import { BsThreeDots } from "react-icons/bs";
import currStoreImg from "../asset/images/img.png"
import { Link } from "react-router-dom";
import { MENU_ITEMS, MENU_ITEMS_MORE } from "../utils/data";

const currentStore = "Jumia";

export default function useSidebar() {
    const [animateOut, setAnimateOut] = useState(false);
    const [isShowSidemenu, setIsShowSidemenu] = useState(false);


    const handleRunCloseNanimate = function() {
        setAnimateOut(true);
        setTimeout(() => {
            setAnimateOut(false);
            setIsShowSidemenu(false);
        }, 300);
    }

    const handleToggleSidemenu = function() {
        if(!isShowSidemenu) {
            setIsShowSidemenu(true);
        } else {
            handleRunCloseNanimate();
        }
    }

    const MobileDashboadMenuUI = function() {
        return (
            <React.Fragment>
                <Overlay handleClose={handleToggleSidemenu} />

                <div className={`dashboard--sidemenu ${animateOut ? 'animate-out' : ''}`}>
                    <span className='hamburger--icon icon--box' onClick={handleToggleSidemenu}>
                        <RiCloseFill />
                    </span>

                    <div className="menu--store">
                        <div className="store--top">
                            <span className="title">Your Store(s)</span>

                            <button className="store--action">
                                <LuSquarePlus />
                                <span>Add Store</span>
                            </button>
                        </div>

                        <div className="store--info">
                            <img src={currStoreImg} alt={currentStore} />
                            <p className="title">{currentStore}</p>
                            <BsThreeDots />
                        </div>
                        <button className="btn--view">View Shop</button>
                    </div>


                    <div className="menu--block">
                        <span className='block--heading'>
                            <p className='heading--text'>Menu</p>
                        </span>

                        <div className="menu--list">
                            {MENU_ITEMS?.map(({ title, src, is_active }, i) => (
                                <Link className={`menu--item ${is_active ? "is-active" : ""}`} to="" key={i}>
                                    <span className='menu--icon'>
                                        <img src={src} alt={title} />
                                    </span>
                                    <p className='menu--text'>{title}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="menu--block">
                        <div className="menu--list">
                            {MENU_ITEMS_MORE?.map(({ title, src }, i) => (
                                <Link className="menu--item" to="" key={i}>
                                    <span className='menu--icon'>
                                        <img src={src} alt={title} />
                                    </span>
                                    <p className='menu--text'>{title}</p>
                                    {title == "Support" && <div className="entity">&nbsp;</div>}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    return { MobileDashboadMenuUI, isShowSidemenu, handleToggleSidemenu }
}
