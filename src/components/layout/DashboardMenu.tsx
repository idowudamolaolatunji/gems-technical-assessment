import { LuSquarePlus } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import currStoreImg from "../../asset/images/img.png"
import { Link } from "react-router-dom";
import { MENU_ITEMS, MENU_ITEMS_MORE } from "../../utils/data";

const currentStore = "Jumia";

export default function DashboardMenu() {
    return (
        <menu className="dashboard--menu">
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
        </menu>
    )
}
