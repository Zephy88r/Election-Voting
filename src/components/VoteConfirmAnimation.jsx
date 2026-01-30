import React from "react";
import Lottie from "lottie-react";
// Put a lottie json in src/assets/ballot.json
import ballotAnim from "../assets/Vote.json";

export default function VoteConfirmAnimation({ open }) {
    if (!open) return null;

    return (
        <div style={styles.backdrop}>
        <div style={styles.card}>
            <div style={{ width: 260, height: 260 }}>
            <Lottie animationData={ballotAnim} loop={false} />
            </div>
            <div style={styles.text}>Casting your vote…</div>
        </div>
        </div>
    );
}

const styles = {
    backdrop: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
    },
    card: {
        background: "#fff",
        borderRadius: 16,
        padding: 20,
        width: 320,
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    },
    text: { marginTop: 10, fontSize: 16, fontWeight: 600 },
};
