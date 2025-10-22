"use client";

import { useEditor } from "@/context/EditorContext";
import { useState } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEnd,
  GithubIcon,
  GitBranchIcon,
  GitPullRequestArrowIcon,
  FolderIcon,
  FileIcon,
  GitCommit,
  GitPullRequest,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { DashboardTrial } from "@/components/dashboard-trial";
import { DashboardUserButton } from "@/components/dashboard-user-button";
import {code, setCode} from "@/context/EditorContext";
import { useAuth } from "@/context/AuthContext";

export function AppSidebar() {
  const [repoUrl, setRepoUrl] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { code, setCode } = useEditor(); // ✅ get current editor code
  const [selectedFile, setSelectedFile] = useState(null);
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [branch, setBranch] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [baseBranch] = useState("main"); // default base
  const [pushing, setPushing] = useState(false);

  const { user } = useAuth();

  // Parse GitHub URL
  function parseRepoUrl(url) {
    try {
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) return null;
      return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
    } catch {
      return null;
    }
  }

async function handleFileClick(filePath) {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) return toast.error("Invalid repo URL");
  setSelectedFile(filePath);
  toast.info(`📂 Loading ${filePath}...`);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/github/file?owner=${parsed.owner}&repo=${parsed.repo}&path=${encodeURIComponent(filePath)}`
    );

    if (!res.ok) throw new Error(`Failed to fetch ${filePath}`);

    const data = await res.json();

    if (!data.content || typeof data.content !== "string") {
      console.error("Unexpected content type:", data);
      return toast.error("Invalid file format received");
    }

    setCode(data.content); // ✅ instantly push into Editor context
    toast.success(`✅ ${filePath} loaded into editor`);
  } catch (err) {
    console.error("❌ Error fetching file:", err);
    toast.error(`Failed to load ${filePath}`);
  }
}



  // Fetch repo structure
  async function fetchRepoTree() {
    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) {
      toast.error("Invalid GitHub URL");
      return;
    }

    setLoading(true);
    toast.info("Fetching repository structure...");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/github/tree?owner=${parsed.owner}&repo=${parsed.repo}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch repo");
      setTreeData(data);
      toast.success(`✅ Repository "${parsed.repo}" loaded successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch repository tree");
    } finally {
      setLoading(false);
    }
  }

  // Render repo tree
  function renderTree(items) {
    return (
      <ul className="ml-3 border-l border-gray-600/20">
        {items.map((item) => (
          <li key={item.id} className="mt-1">
            {item.type === "folder" ? (
              <details open>
                <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                  <FolderIcon className="w-4 h-4 text-blue-400" />
                  {item.name}
                </summary>
                {renderTree(item.children || [])}
              </details>
            ) : (
              <div
                onClick={() => handleFileClick(item.path)}
                className="flex items-center gap-2 text-sm text-gray-300 ml-5 cursor-pointer hover:text-blue-400 transition"
              >
                <FileIcon className="w-4 h-4" />
                {item.name}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }

  // ✅ Handle Commit API
  async function handleCommit() {
    const parsed = parseRepoUrl(repoUrl);
    if (!parsed || !branch || !commitMessage)
      return toast.error("Please fill all fields");

    setPushing(true);
    toast.loading("Committing changes...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/github/commit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: parsed.owner,
            repo: parsed.repo,
            email: user?.email,
            branch,
            baseBranch,
            message: commitMessage,
            files: [
              {
                path: selectedFile || "main_file.js", 
                content: code,
              },
            ],
            
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.dismiss();
      toast.success(`✅ Commit pushed to ${branch}`);
      console.log(`User email used: ${user?.email}`);
      console.log("Commit URLs:", data.commitUrls);
      setOpenDialog(false);
    } catch (err) {
      toast.dismiss();
      toast.error(`Commit failed: ${err.message}`);
      console.error(err);
    } finally {
      setPushing(false);
    }
  }

  // ✅ Handle Pull Request API
  async function handlePR() {
    const parsed = parseRepoUrl(repoUrl);
    if (!parsed || !branch)
      return toast.error("Missing branch or repository info");

    toast.loading("Creating pull request...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/github/pull-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: parsed.owner,
            repo: parsed.repo,
            branch,
            baseBranch,
            title: commitMessage || "Auto PR from Slofy",
            body: "This pull request was generated via Slofy AI Review.",
            email: user?.email,
          }),
        }
      );

      const data = await res.json();
      toast.dismiss();

      if (data.status === "exists")
        toast.info(`⚠️ PR already exists: ${data.url}`);
      else toast.success(`✅ Pull Request created: ${data.url}`);
      setOpenDialog(false);
    } catch (err) {
      toast.dismiss();
      toast.error(`PR creation failed: ${err.message}`);
      console.error(err);
    }
  }

  return (
    <Sidebar variant="sidebar">
      {/* Brand Header */}
      <SidebarHeader className="text-sidebar-accent-foreground text-center items-center justify-center border-b border-sidebar-border pb-3">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <GalleryVerticalEnd className="size-4" />
          <p className="text-xl font-semibold">Slofy</p>
        </Link>
      </SidebarHeader>

      <div className="px-4 pb-2">
        <Separator className="opacity-10 text-[#5D6B68]" />
      </div>

      {/* GitHub Section */}
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <GithubIcon className="size-4" />
          GitHub
        </SidebarGroupLabel>

        <SidebarGroupContent>
          <div className="mt-2 space-y-3 px-2">
            <Input
              placeholder="https://github.com/user/repo"
              className="bg-sidebar-accent text-sidebar-foreground"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <Button
              onClick={fetchRepoTree}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <GitBranchIcon className="w-4 h-4" />
              {loading ? "Fetching..." : "Fetch Repo"}
            </Button>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Repo Tree */}
      <SidebarContent className="overflow-y-auto no-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel>Repository Structure</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="bg-sidebar-accent rounded-md p-2 border border-sidebar-border max-h-[400px] overflow-y-auto no-scrollbar">
              {treeData.length > 0 ? (
                renderTree(treeData)
              ) : (
                <p className="text-sm text-muted-foreground px-2">
                  Enter a repo URL and click “Fetch Repo”
                </p>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-3" />

        {/* Repo Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-2">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-sidebar-border flex items-center justify-center gap-2"
                >
                  <GitPullRequestArrowIcon className="w-4 h-4" />
                  Push Changes
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px] bg-[#111] text-gray-100">
                <DialogHeader>
                  <DialogTitle>Push Changes</DialogTitle>
                  <DialogDescription>
                    Provide a branch name and commit message for your changes.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <label htmlFor="branch" className="text-sm font-medium">
                      Branch Name
                    </label>
                    <Input
                      id="branch"
                      placeholder="feature/my-fix"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="commitMessage" className="text-sm font-medium">
                      Commit Message
                    </label>
                    <Input
                      id="commitMessage"
                      placeholder="Describe your changes"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter className="flex gap-2 justify-end">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleCommit}
                    disabled={pushing}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <GitCommit className="w-4 h-4" /> Commit
                  </Button>
                  <Button
                    onClick={handlePR}
                    disabled={pushing}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    <GitPullRequest className="w-4 h-4" /> Create PR
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="flex flex-col gap-3 p-3 border-t border-sidebar-border text-white">
        <DashboardTrial />
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
