import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const StudentCourses: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/student/course-materials', { headers: { Authorization: `Bearer ${token}` } });
        setMaterials(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Course Materials</h2>
      {loading && <div>Loading…</div>}
      <div className="grid grid-cols-1 gap-3">
        {materials.map((m) => (
          <div key={m.id} className="card p-4">
            <div className="font-semibold">{m.title}</div>
            <div className="text-sm text-gray-600">{m.description}</div>
          </div>
        ))}
        {!loading && materials.length === 0 && <div className="text-gray-500">No materials found.</div>}
      </div>
    </div>
  );
};

export default StudentCourses;
