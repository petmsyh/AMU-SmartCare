import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchDoctors } from "../../store/slices/doctorsSlice";
import RatingStars from "../../components/RatingStars";

const DoctorList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    list: doctors,
    loading,
    error,
  } = useSelector((state: RootState) => state.doctors);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");

  useEffect(() => {
    dispatch(fetchDoctors({}));
  }, [dispatch]);

  const handleFilter = () => {
    dispatch(
      fetchDoctors({
        specialty: specialty || undefined,
        name: search || undefined,
      }),
    );
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: 10,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  };

  const tierColor: Record<string, string> = {
    GeneralPractitioner: "#34a853",
    Specialist: "#1a73e8",
    SuperSpecialist: "#9c27b0",
  };
  const asNumber = (value: unknown) => {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 22 }}>Find Doctors</h2>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              display: "block",
              marginBottom: 4,
            }}
          >
            Search by name
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Dr. Name…"
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 13,
              width: 200,
            }}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              display: "block",
              marginBottom: 4,
            }}
          >
            Specialty
          </label>
          <input
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g. Cardiology"
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 13,
              width: 180,
            }}
          />
        </div>
        <button
          onClick={handleFilter}
          style={{
            padding: "8px 20px",
            background: "#1a73e8",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearch("");
            setSpecialty("");
            dispatch(fetchDoctors({}));
          }}
          style={{
            padding: "8px 16px",
            background: "#fff",
            color: "#666",
            border: "1px solid #ddd",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Clear
        </button>
      </div>

      {loading && <p style={{ color: "#666" }}>Loading doctors…</p>}
      {error && (
        <div
          style={{
            background: "#fce8e6",
            color: "#c5221f",
            padding: "10px 14px",
            borderRadius: 6,
          }}
        >
          {error}
        </div>
      )}

      {!loading && doctors.length === 0 && (
        <p style={{ color: "#666" }}>No doctors found.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {doctors.map((doc) => {
          const avgRating = asNumber(doc.averageRating);
          const fee = asNumber(doc.consultationFee);
          return (
          <div key={doc.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#e8f0fe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                👨‍⚕️
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 15,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {doc.fullName}
                </h3>
                <p style={{ margin: "2px 0 0", color: "#666", fontSize: 12 }}>
                  {doc.specialty}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  background: `${tierColor[doc.tier] || "#666"}20`,
                  color: tierColor[doc.tier] || "#666",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 12,
                }}
              >
                {doc.tier}
              </span>
              <span style={{ fontSize: 12, color: "#666" }}>
                {doc.experience} yrs exp
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <RatingStars value={Math.round(avgRating)} size={16} />
              <span style={{ fontSize: 12, color: "#666" }}>
                {avgRating.toFixed(1)} ({doc.totalRatings} reviews)
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <span style={{ fontWeight: 600, color: "#1a73e8", fontSize: 15 }}>
                ₹{fee}
              </span>
              <Link
                to={`/patient/doctors/${doc.id}`}
                style={{
                  padding: "6px 14px",
                  background: "#1a73e8",
                  color: "#fff",
                  borderRadius: 4,
                  textDecoration: "none",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                View Profile
              </Link>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorList;
