import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuGlobe } from "react-icons/lu";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { BsCheckSquare } from "react-icons/bs";
import MainContent from "../components/layout/MainContent";
import TableContent from "../components/layout/TableContent";
import { useSessionMonitor } from "../hooks/useSessionMonitor";


export default function HomePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams.get("tab")
    const [activeTab, setActiveTab] = useState("");

    // Check every 60 seconds
    useSessionMonitor(60000);

    useEffect(function() {
        window.scrollTo(0, 0);

        if (tabParams) {
            setActiveTab(tabParams)
        }
    }, [tabParams]);

    return (
        <section className="section--page">
            <div className="page--top">
                {/* PAGE TITLE */}
                <div className="page--heading">
                    <h4 className={`title ${activeTab === "report" ? "blured" : ""}`}>Analytics</h4>
                    {activeTab === "report" && (
                        <span className="subtitle">- Report</span>
                    )}
                </div>

                {/* PAGE TOP ACTIONS */}
                <div className="page--actions">
                    <div className="actions--flex">
                        <button className={`action--btn ${activeTab == "report" ? "is-active" : ""}`} onClick={() => navigate("?tab=report")}><HiOutlineDocumentReport /> Report</button>
                        <button className="action--btn" onClick={() => {
                            navigate("");
                            setActiveTab("");
                        }}><LuGlobe /> Live View</button>
                    </div>

                    <div className="actions--flex">
                        {activeTab !== "report" && (
                            <React.Fragment>
                                <button className="action--btn" onClick={() => {}}><HiOutlineCalendarDateRange /> Today</button>
                                <button className="action--btn" onClick={() => {}}>Compared to: Yesterday</button>
                            </React.Fragment>
                        )}
                        <span className="action--btn"><BsCheckSquare /> Auto Refresh</span>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="page--content">
                {activeTab !== "report" ? (
                    <MainContent />
                ) : (
                    <TableContent />
                )}
            </div>
        </section>
    );
}
