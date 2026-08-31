import SideMenuComponent from "../components/SideMenuComponent"
import { useState, useEffect } from "react"
import api from "../api"
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

function Statistics(){

    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getStats = async () => {
            try {
                const response = await api.get("/api/stats/documents/")
                setStats(response.data)
            } catch (error) {
                console.error("Error loading statistics:", error)
            } finally {
                setLoading(false)
            }
        }
        getStats()
    }, [])

    if(loading) return <p className="text-[#575757] text-center text-xl mt-24">Loading statistics...</p>
    if(!stats || stats.by_type.length === 0) {
        return <div className="ml-18 mr-18 mt-12">
            <p className="text-[#575757] text-center text-xl">No documents to show statistics for yet.</p>
        </div>
    }

    return <div className="overflow-hidden">
        <main className="ml-18 mr-18 pt-8 pb-12">
            <h1 className="text-7xl font-dots mb-12">Knowledge Base Stats</h1>

            <div className="grid grid-cols-2 gap-12">

                {/* dokumenti po tipu fajla */}
                <div className="bg-[#575757] rounded-2xl p-8">
                    <h2 className="text-white text-2xl mb-6 uppercase">By file type</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={stats.by_type}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                            <XAxis dataKey="file_type" stroke="#fff" />
                            <YAxis stroke="#fff" allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#DEFF5C" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* dokumenti kroz vreme */}
                <div className="bg-[#575757] rounded-2xl p-8">
                    <h2 className="text-white text-2xl mb-6 uppercase">Uploads over time</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={stats.by_month}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                            <XAxis dataKey="month" stroke="#fff" />
                            <YAxis stroke="#fff" allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#DEFF5C" strokeWidth={3} dot={{ fill: "#DEFF5C" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* dokumenti po tagu */}
                <div className="bg-[#575757] rounded-2xl p-8 col-span-2">
                    <h2 className="text-white text-2xl mb-6 uppercase">By tag</h2>
                    {stats.by_tag.length === 0 ? (
                        <p className="text-white/60">No tagged documents yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={stats.by_tag}
                                    dataKey="count"
                                    nameKey="name"
                                    outerRadius={100}
                                    label
                                >
                                    {stats.by_tag.map((tag, i) => (
                                        <Cell key={i} fill={tag.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

            </div>
        </main>

        <SideMenuComponent navigateTo="/document_manager" label="document manager" side="left"></SideMenuComponent>
        <SideMenuComponent navigateTo="/" label="home" side="right"></SideMenuComponent>
    </div>
}

export default Statistics