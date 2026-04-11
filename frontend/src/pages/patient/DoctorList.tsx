import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchDoctors } from "../../store/slices/doctorsSlice";
import RatingStars from "../../components/RatingStars";

const tierBadgeClass: Record<string, string> = {
  GeneralPractitioner: "bg-success-100 text-success-700",
  Specialist: "bg-primary-50 text-primary-600",
  SuperSpecialist: "bg-purple-100 text-purple-700",
};

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

  const asNumber = (value: unknown) => {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold text-gray-800">Find Doctors</h2>

      <div className="card mb-5 flex flex-wrap items-end gap-3 p-4">
        <div>
          <label className="form-label">Search by name</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Dr. Name…"
            className="form-input w-52"
          />
        </div>
        <div>
          <label className="form-label">Specialty</label>
          <input
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g. Cardiology"
            className="form-input w-48"
          />
        </div>
        <button onClick={handleFilter} className="btn-primary btn-sm">
          Search
        </button>
        <button
          onClick={() => {
            setSearch("");
            setSpecialty("");
            dispatch(fetchDoctors({}));
          }}
          className="btn-ghost btn-sm"
        >
          Clear
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading doctors…</p>}
      {error && (
        <div className="mb-4 rounded-lg bg-danger-100 px-4 py-3 text-danger-700">
          {error}
        </div>
      )}

      {!loading && doctors.length === 0 && (
        <p className="text-gray-500">No doctors found.</p>
      )}

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {doctors.map((doc) => {
          const avgRating = asNumber(doc.averageRating);
          const fee = asNumber(doc.consultationFee);
          return (
            <div key={doc.id} className="card flex flex-col gap-2 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-2xl">
                  👨‍⚕️
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 truncate text-sm font-semibold text-gray-800">
                    {doc.fullName}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">{doc.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`badge ${tierBadgeClass[doc.tier] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {doc.tier}
                </span>
                <span className="text-xs text-gray-500">
                  {doc.experience} yrs exp
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <RatingStars value={Math.round(avgRating)} size={16} />
                <span className="text-xs text-gray-500">
                  {avgRating.toFixed(1)} ({doc.totalRatings} reviews)
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary-500">
                  ₹{fee}
                </span>
                <Link
                  to={`/patient/doctors/${doc.id}`}
                  className="btn-primary btn-sm"
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
