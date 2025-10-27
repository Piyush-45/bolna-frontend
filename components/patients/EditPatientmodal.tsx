'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import QuestionsEditor from '../QuestionEditor';

interface Patient {
  id: number;
  name: string;
  phone: string;
  age: number;
  language: string;
  custom_questions: string[] | string | null; // can be array or string
}

interface EditPatientModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPatientModal({
  patient,
  isOpen,
  onClose,
  onSuccess,
}: EditPatientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    language: 'english',
    patient_type: 'opd',
  });

  const [questions, setQuestions] = useState<string[]>([]);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE

  // 🧠 Convert stored questions to editable string array safely
  const parseQuestions = (input: string[] | string | null): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input; // already array ✅
    if (typeof input === 'string') {
      return input
        .split('\n')
        .map((q) => q.replace(/^\d+\.\s*/, '').trim())
        .filter((q) => q);
    }
    return [];
  };

  // 🪄 Load patient data into modal
  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        phone: patient.phone,
        age: patient.age?.toString() || '',
        language: patient.language?.toLowerCase() || 'english',
        patient_type: 'opd',
      });

      setQuestions(parseQuestions(patient.custom_questions));
    }
  }, [patient]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Update patient base info
      const res = await fetch(`${API_BASE}/patients/${patient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          age: parseInt(formData.age),
          language: formData.language.toLowerCase(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to update patient');
      }

      // 2️⃣ Update questions if any
      const validQuestions = questions.filter((q) => q.trim() !== '');
      const qRes = await fetch(`${API_BASE}/patients/${patient.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: validQuestions }),
      });

      if (!qRes.ok) {
        console.warn('⚠️ Question update failed');
      }

      toast.success('Patient updated successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Error updating patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edit Patient</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Patient Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Type *
              </label>
              <select
                value={formData.patient_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    patient_type: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="opd">OPD</option>
                <option value="discharged">Discharged</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age *
              </label>
              <input
                type="number"
                required
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Language *
              </label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="marathi">Marathi</option>
                <option value="tamil">Tamil</option>
                <option value="telugu">Telugu</option>
                <option value="spanish">Spanish</option>
              </select>
            </div>

            {/* Custom Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Questions
              </label>
              <button
                type="button"
                onClick={() => setShowQuestionEditor(true)}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
              >
                {questions.length > 0
                  ? `${questions.length} questions configured`
                  : 'Click to add custom questions'}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showQuestionEditor && (
        <QuestionsEditor
          patientId={patient.id}
          patientName={formData.name}
          currentQuestions={questions}
          onSave={async (newQuestions) => {
            setQuestions(newQuestions);
            setShowQuestionEditor(false);
          }}
          onClose={() => setShowQuestionEditor(false)}
        />
      )}
    </>
  );
}
