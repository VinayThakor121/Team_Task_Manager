"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/page-header";
import { interviewService } from "@/services/interviews";
import { resumeService } from "@/services/resumes";

export default function CreateInterviewPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      role: "Frontend Developer",
      experienceLevel: "Mid",
      techStack: "JavaScript, React, Next.js",
      interviewType: "Mixed",
      questionCount: 8,
      resumeId: "",
    },
  });

  useEffect(() => {
    resumeService.list().then(setResumes).catch(() => {});
  }, []);

  const onUploadResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const uploaded = await resumeService.upload(file);
      setResumes((current) => [uploaded, ...current]);
      setValue("resumeId", uploaded._id);
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || "Resume upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    try {
      const interview = await interviewService.create(values);
      router.push(`/interview/${interview._id}`);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to create interview.");
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Create Interview"
        title="Generate your next AI mock interview"
        description="Set role, level, stack, interview type, optional resume context, and create question sets with Gemini."
      />

      <form onSubmit={onSubmit} className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 xl:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Job role</label>
            <input {...register("role", { required: true })} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Experience level</label>
            <select {...register("experienceLevel", { required: true })} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white">
              {[
                "Intern",
                "Junior",
                "Mid",
                "Senior",
                "Lead",
              ].map((level) => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Tech stack (comma separated)</label>
            <input {...register("techStack", { required: true })} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Interview type</label>
            <select {...register("interviewType", { required: true })} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white">
              {["Technical", "Behavioral", "Mixed"].map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Question count</label>
            <input type="number" min="5" max="15" {...register("questionCount", { valueAsNumber: true })} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Resume upload (PDF)</label>
            <input type="file" accept="application/pdf" onChange={onUploadResume} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
            <p className="mt-2 text-xs text-slate-500">{uploading ? "Uploading resume..." : "Upload to generate resume-based questions."}</p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Use uploaded resume</label>
            <select {...register("resumeId")} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white">
              <option value="">No resume context</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>{resume.fileName}</option>
              ))}
            </select>
          </div>

          {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}

          <button disabled={isSubmitting} className="w-full rounded-2xl bg-violet-500 px-4 py-3 font-semibold text-white disabled:opacity-70">
            {isSubmitting ? "Generating interview..." : "Create interview"}
          </button>
        </div>
      </form>
    </div>
  );
}
