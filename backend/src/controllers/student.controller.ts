import { Request, Response } from 'express';
import { AuthRequest } from '../types';

// Minimal course materials endpoint — returns static example materials per department.
export const studentController = {
  async listCourseMaterials(req: AuthRequest, res: Response) {
    try {
      const dept = req.user?.department || 'general';

      const sampleByDept: Record<string, any[]> = {
        medicine: [
          { id: 'med-1', title: "Anatomy 101", description: 'Basic anatomy notes' },
          { id: 'med-2', title: 'Pharmacology Essentials', description: 'Core drugs and mechanisms' },
        ],
        pharmacy: [
          { id: 'pharm-1', title: 'Pharm Foundations', description: 'Drug classes overview' },
        ],
        general: [
          { id: 'g-1', title: 'Study Tips', description: 'How to study effectively' },
        ],
      };

      const materials = sampleByDept[dept.toLowerCase()] || sampleByDept.general;

      return res.json({ success: true, data: materials });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Could not fetch course materials' });
    }
  },
};

export default studentController;
