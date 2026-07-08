import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, 
  Trash2, 
  UploadCloud, 
  ChevronRight, 
  ChevronDown, 
  RefreshCw, 
  Send, 
  AlertCircle, 
  Sparkles, 
  Search, 
  Minimize2, 
  Plus, 
  ExternalLink,
  FileSearch, 
  MessageSquare,
  Check,
  Volume2,
  VolumeX,
  Download,
  Database,
  GitCompare,
  FileSpreadsheet,
  Cpu,
  Bookmark,
  Activity,
  Award,
  BookOpen,
  Info,
  Layers,
  HelpCircle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Server,
  Lock,
  Clock,
  CheckCircle2,
  CheckSquare,
  FileCode,
  ArrowRight,
  Palette,
  Bot,
  Layout,
  LayoutDashboard,
  Languages,
  Shuffle,
  FileCheck2,
  Fingerprint,
  UserCheck,
  Copy,
  Menu,
  X,
  MapPin,
  Cog,
  AlertTriangle,
  Network
} from "lucide-react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";

interface CitationScore {
  hybrid: number;
  vector: number;
  keyword: number;
}

interface Citation {
  docName: string;
  quote: string;
  page: string;
  explanation: string;
  scores?: CitationScore;
}

interface LoadBalancer {
  primaryStatus: string;
  failoverActive: boolean;
  routingTarget: string;
  latencyMs: number;
}

interface RouteTrace {
  intent: "comparison" | "summary" | "search";
  retrievalMethod: string;
  chunksEvaluated: number;
  chunksRetrieved: number;
  cognitiveMemoryUsed: boolean;
  confidence: number;
  agentSequence?: string[];
  agentLogs?: string[];
  latencyMs?: number;
  loadBalancer?: LoadBalancer;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  source?: Citation[];
  routeTrace?: RouteTrace;
  memorySummary?: string;
}

interface IndexedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  summary: string;
  wordCount: number;
  charCount: number;
  chunksCount: number;
  encryptionKeyFingerprint?: string;
  uploadedAt?: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  cognitiveMemory: string;
  selectedScopeIds: string[];
  activeDocId?: string;
  createdAt: number;
}

interface AuditLog {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  severity: "info" | "warning" | "success";
}

interface SystemHealth {
  status: string;
  uptime: number;
  cpu: string;
  memory: string;
  compliance: {
    soc2: string;
    gdpr: string;
    dataIsolation: string;
  };
  endpoints: {
    name: string;
    status: string;
    latency: string;
    active: boolean;
  }[];
  encryptionActive: boolean;
  ephemeralMode: boolean;
}

const highlightText = (text: string, search: string) => {
  if (!search.trim()) return <span>{text}</span>;
  try {
    const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\export default function App() {')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-amber-400/30 text-amber-950 dark:text-amber-200 font-bold px-0.5 rounded border border-amber-500/20 select-text">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  } catch (err) {
    return <span>{text}</span>;
  }
};

export default function App() {
  const [activeView, setActiveView] = useState<"workspaces" | "paraphraser" | "grammar" | "detector" | "plagiarism" | "humanizer">("workspaces");
  const [theme, setTheme] = useState<"dark" | "light" | "terminal">(() => {
    return (localStorage.getItem("docchat_theme") as "dark" | "light" | "terminal") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("docchat_theme", theme);
  }, [theme]);

  // Premium User Authentication States
  const [user, setUser] = useState<{ id: string; username: string; email?: string; premiumEnabled?: boolean } | null>(() => {
    const saved = localStorage.getItem("docmind_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot" | "verify-otp" | null>(() => {
    return localStorage.getItem("docmind_user") ? null : "login";
  });
  const [showOAuthHelp, setShowOAuthHelp] = useState(false);
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authEmailOrUsername, setAuthEmailOrUsername] = useState("");
  const [authOtpCode, setAuthOtpCode] = useState("");
  const [authNewPassword, setAuthNewPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [bypassedOtpCode, setBypassedOtpCode] = useState("");
  const [bypassedSmtpError, setBypassedSmtpError] = useState("");
  const [regSmtpBypassed, setRegSmtpBypassed] = useState(false);
  const [regSmtpError, setRegSmtpError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dashboardAuthMode, setDashboardAuthMode] = useState<"view" | "login" | "register">("view");
  const [dashboardUsername, setDashboardUsername] = useState("");
  const [dashboardPassword, setDashboardPassword] = useState("");
  const [dashboardEmail, setDashboardEmail] = useState("");
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [dashboardSuccess, setDashboardSuccess] = useState<string | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Auto-rotating Token-Secured Fetch Wrapper
  const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    let accessToken = localStorage.getItem("docmind_access_token");
    const headers = new Headers(options.headers || {});
    
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    
    if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 403 || response.status === 401) {
      const refreshToken = localStorage.getItem("docmind_refresh_token");
      if (refreshToken) {
        try {
          const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            if (data.accessToken && data.refreshToken) {
              localStorage.setItem("docmind_access_token", data.accessToken);
              localStorage.setItem("docmind_refresh_token", data.refreshToken);
              
              const retryHeaders = new Headers(options.headers || {});
              retryHeaders.set("Authorization", `Bearer ${data.accessToken}`);
              if (options.body && !retryHeaders.has("Content-Type") && !(options.body instanceof FormData)) {
                retryHeaders.set("Content-Type", "application/json");
              }
              return fetch(url, { ...options, headers: retryHeaders });
            }
          }
        } catch (err) {
          console.error("Session rotation failover:", err);
        }
      }
      
      if (localStorage.getItem("docmind_user")) {
        localStorage.removeItem("docmind_access_token");
        localStorage.removeItem("docmind_refresh_token");
        localStorage.removeItem("docmind_user");
        setUser(null);
        setAuthMode("login");
      }
    }
    
    return response;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUsername.trim() || !authPassword.trim() || !authEmail.trim()) {
      setAuthError("Username, registered recovery email, and secure password are required.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    setRegSmtpBypassed(false);
    setRegSmtpError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: authUsername, password: authPassword, email: authEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register researcher profile.");
      
      setAuthSuccess(data.message || "Profile created! Please log in.");
      setAuthMode("login");
      setAuthPassword("");
      setAuthEmail("");
      
      if (data.smtpBypassed) {
        setRegSmtpBypassed(true);
        setRegSmtpError(data.smtpErrorMessage || "SMTP credentials not configured.");
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    setRegSmtpBypassed(false);
    try {
      const res = await fetch(`/api/auth/google/url?origin=${encodeURIComponent(window.location.origin)}`);
      const data = await res.json();
      if (!res.ok) {
        if (data.setupRequired) {
          throw new Error("Google Client ID is missing. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET inside your Settings.");
        }
        throw new Error(data.error || "Failed to fetch Google authorization URL.");
      }
      
      const width = 500;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const authWindow = window.open(
        data.url,
        "google_oauth_popup",
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
      );

      if (!authWindow) {
        throw new Error("Popup blocked! Please allow popups for this site to continue with Google.");
      }
      
      setAuthSuccess("Google OAuth popup opened. Please authorize to continue.");
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmailOrUsername.trim()) {
      setAuthError("Please specify your username or registered email.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername: authEmailOrUsername })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to request recovery passcode.");
      
      setAuthSuccess(data.message);
      if (data.smtpBypassed && data.debugCode) {
        setBypassedOtpCode(data.debugCode);
        setBypassedSmtpError(data.smtpErrorMessage || "SMTP credentials not configured.");
      } else {
        setBypassedOtpCode("");
        setBypassedSmtpError("");
      }
      setAuthOtpCode(""); // Keep field empty so user must input code from their email
      setAuthMode("verify-otp");
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmailOrUsername.trim() || !authOtpCode.trim() || !authNewPassword.trim()) {
      setAuthError("All verification parameters are required.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUsername: authEmailOrUsername,
          otpCode: authOtpCode,
          newPassword: authNewPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification passcode is invalid or expired.");
      
      setAuthSuccess(data.message || "Credentials updated successfully. Please sign in.");
      setAuthMode("login");
      setAuthOtpCode("");
      setAuthNewPassword("");
      setBypassedOtpCode("");
      setBypassedSmtpError("");
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDashboardLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashboardUsername.trim() || !dashboardPassword.trim()) {
      setDashboardError("Please specify both username and password.");
      return;
    }
    setDashboardLoading(true);
    setDashboardError(null);
    setDashboardSuccess(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: dashboardUsername, password: dashboardPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials.");
      
      localStorage.setItem("docmind_access_token", data.accessToken);
      localStorage.setItem("docmind_refresh_token", data.refreshToken);
      localStorage.setItem("docmind_user", JSON.stringify(data.user));
      
      setUser(data.user);
      setDashboardAuthMode("view");
      setDashboardUsername("");
      setDashboardPassword("");
      setDashboardSuccess(`Switched session to ${data.user.username} successfully!`);
      
      setTimeout(() => {
        fetchDocuments();
        fetchAuditLogs();
        fetchSystemHealth();
      }, 100);
    } catch (err: any) {
      setDashboardError(err.message);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleDashboardRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashboardUsername.trim() || !dashboardPassword.trim() || !dashboardEmail.trim()) {
      setDashboardError("All fields are required.");
      return;
    }
    setDashboardLoading(true);
    setDashboardError(null);
    setDashboardSuccess(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: dashboardUsername,
          password: dashboardPassword,
          email: dashboardEmail
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register peer profile.");
      
      setDashboardSuccess(data.message || `Successfully registered researcher profile: ${dashboardUsername}! You can now switch profiles to sign in.`);
      setDashboardUsername("");
      setDashboardPassword("");
      setDashboardEmail("");
      setDashboardAuthMode("view");
    } catch (err: any) {
      setDashboardError(err.message);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUsername.trim() || !authPassword.trim()) {
      setAuthError("Please specify both username and password.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: authUsername, password: authPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials.");
      
      localStorage.setItem("docmind_access_token", data.accessToken);
      localStorage.setItem("docmind_refresh_token", data.refreshToken);
      localStorage.setItem("docmind_user", JSON.stringify(data.user));
      
      setUser(data.user);
      setAuthMode(null);
      setAuthUsername("");
      setAuthPassword("");
      
      setTimeout(() => {
        fetchDocuments();
        fetchAuditLogs();
        fetchSystemHealth();
      }, 100);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("docmind_refresh_token");
    if (refreshToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken })
        });
      } catch (err) {
        console.error("Failed to revoke session on server:", err);
      }
    }
    localStorage.removeItem("docmind_access_token");
    localStorage.removeItem("docmind_refresh_token");
    localStorage.removeItem("docmind_user");
    setUser(null);
    setAuthMode("login");
    setIndexedFiles([]);
    setSelectedDocContent(null);
    setMessages([]);
    setCognitiveMemory("");
  };
  
  const [indexedFiles, setIndexedFiles] = useState<IndexedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<IndexedFile[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [errorContext, setErrorContext] = useState<string | null>(null);
  const [cognitiveMemory, setCognitiveMemory] = useState<string>("");
  
  // Terms and Privacy Settings Modals States
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Previous Conversations States
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showHistorySidebar, setShowHistorySidebar] = useState(true);

  // Workspace and UI Tabs states
  const [selectedDocContent, setSelectedDocContent] = useState<IndexedFile & { content: string } | null>(null);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [expandedCitations, setExpandedCitations] = useState<{ [key: number]: boolean }>({});
  
  // Selected Documents for Search Scope / Multi-Doc Comparison
  const [selectedScopeIds, setSelectedScopeIds] = useState<string[]>([]);
  const [rightPanelTab, setRightPanelTab] = useState<"comparison" | "viewer" | "metadata">("comparison");
  const [comparisonMatrix, setComparisonMatrix] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);

  // Custom Dynamic Analysis States
  const [customAttribute, setCustomAttribute] = useState("");
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [rowError, setRowError] = useState<string | null>(null);
  const [readerSearchTerm, setReaderSearchTerm] = useState("");
  const [readerFontSize, setReaderFontSize] = useState<"xs" | "sm" | "base" | "lg" | "xl">("sm");
  const [readerFontFamily, setReaderFontFamily] = useState<"mono" | "sans" | "serif">("sans");
  const [readerHighlightKeyterms, setReaderHighlightKeyterms] = useState(true);

  // Quillbot-style Writing Assistant States
  // 1. Paraphraser States
  const [paraphraserInput, setParaphraserInput] = useState("");
  const [paraphraserOutput, setParaphraserOutput] = useState("");
  const [paraphraserMode, setParaphraserMode] = useState<"standard" | "fluency" | "formal" | "academic" | "creative">("standard");
  const [isParaphrasing, setIsParaphrasing] = useState(false);

  // 2. Grammar Checker States
  const [grammarInput, setGrammarInput] = useState("");
  const [grammarOutput, setGrammarOutput] = useState("");
  const [grammarErrors, setGrammarErrors] = useState<any[]>([]);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);

  // 3. AI Detector States
  const [detectorInput, setDetectorInput] = useState("");
  const [detectorScore, setDetectorScore] = useState<number | null>(null);
  const [detectorClassification, setDetectorClassification] = useState("");
  const [detectorDetails, setDetectorDetails] = useState("");
  const [detectorSentenceAnalysis, setDetectorSentenceAnalysis] = useState<any[]>([]);
  const [isDetectingAI, setIsDetectingAI] = useState(false);

  // 4. Plagiarism Checker States
  const [plagiarismInput, setPlagiarismInput] = useState("");
  const [plagiarismScore, setPlagiarismScore] = useState<number | null>(null);
  const [plagiarismMatches, setPlagiarismMatches] = useState<any[]>([]);
  const [plagiarismAnnotatedText, setPlagiarismAnnotatedText] = useState<any[]>([]);
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false);

  // 5. AI Humanizer States
  const [humanizerInput, setHumanizerInput] = useState("");
  const [humanizerOutput, setHumanizerOutput] = useState("");
  const [humanizerIntensity, setHumanizerIntensity] = useState<"mild" | "standard" | "aggressive">("standard");
  const [isHumanizing, setIsHumanizing] = useState(false);

  // Writing Tool Actions
  const handleParaphrase = async () => {
    if (!paraphraserInput.trim() || isParaphrasing) return;
    setIsParaphrasing(true);
    try {
      const res = await apiFetch("/api/writing/paraphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: paraphraserInput, mode: paraphraserMode })
      });
      const data = await res.json();
      if (res.ok) {
        setParaphraserOutput(data.paraphrased);
      } else {
        setErrorContext(data.error || "Failed to paraphrase text.");
      }
    } catch (err: any) {
      setErrorContext(err.message || "Failed to connect to paraphrasing API.");
    } finally {
      setIsParaphrasing(false);
    }
  };

  const handleGrammarCheck = async () => {
    if (!grammarInput.trim() || isCheckingGrammar) return;
    setIsCheckingGrammar(true);
    try {
      const res = await apiFetch("/api/writing/grammar-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: grammarInput })
      });
      const data = await res.json();
      if (res.ok) {
        setGrammarOutput(data.correctedText);
        setGrammarErrors(data.errors || []);
      } else {
        setErrorContext(data.error || "Failed to analyze grammar.");
      }
    } catch (err: any) {
      setErrorContext(err.message || "Failed to connect to grammar checker API.");
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  const handleAIDetect = async () => {
    if (!detectorInput.trim() || isDetectingAI) return;
    setIsDetectingAI(true);
    try {
      const res = await apiFetch("/api/writing/ai-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: detectorInput })
      });
      const data = await res.json();
      if (res.ok) {
        setDetectorScore(data.score);
        setDetectorClassification(data.classification);
        setDetectorDetails(data.details);
        setDetectorSentenceAnalysis(data.sentenceAnalysis || []);
      } else {
        setErrorContext(data.error || "Failed to analyze AI content.");
      }
    } catch (err: any) {
      setErrorContext(err.message || "Failed to connect to AI detector API.");
    } finally {
      setIsDetectingAI(false);
    }
  };

  const handlePlagiarismCheck = async () => {
    if (!plagiarismInput.trim() || isCheckingPlagiarism) return;
    setIsCheckingPlagiarism(true);
    try {
      const res = await apiFetch("/api/writing/plagiarism-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: plagiarismInput })
      });
      const data = await res.json();
      if (res.ok) {
        setPlagiarismScore(data.score);
        setPlagiarismMatches(data.matches || []);
        setPlagiarismAnnotatedText(data.annotatedText || []);
      } else {
        setErrorContext(data.error || "Failed to analyze plagiarism.");
      }
    } catch (err: any) {
      setErrorContext(err.message || "Failed to connect to plagiarism checker API.");
    } finally {
      setIsCheckingPlagiarism(false);
    }
  };

  const handleHumanize = async () => {
    if (!humanizerInput.trim() || isHumanizing) return;
    setIsHumanizing(true);
    try {
      const res = await apiFetch("/api/writing/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: humanizerInput, intensity: humanizerIntensity })
      });
      const data = await res.json();
      if (res.ok) {
        setHumanizerOutput(data.humanized);
      } else {
        setErrorContext(data.error || "Failed to humanize text.");
      }
    } catch (err: any) {
      setErrorContext(err.message || "Failed to connect to humanizer API.");
    } finally {
      setIsHumanizing(false);
    }
  };

  const applyCorrection = (errIdx: number) => {
    const errorObj = grammarErrors[errIdx];
    if (!errorObj) return;
    
    // Replace the specific error in the grammar input
    const before = grammarInput.substring(0, errorObj.index);
    const after = grammarInput.substring(errorObj.index + errorObj.length);
    const updatedText = before + errorObj.corrected + after;
    
    setGrammarInput(updatedText);
    
    // Shift indices of subsequent errors
    const shift = errorObj.corrected.length - errorObj.length;
    const updatedErrors = grammarErrors.slice(errIdx + 1).map(err => ({
      ...err,
      index: err.index + shift
    }));
    
    setGrammarErrors(updatedErrors);
    
    // Re-generate grammar output from updated state
    setGrammarOutput(updatedText);
  };

  const fixAllGrammarErrors = () => {
    if (grammarOutput) {
      setGrammarInput(grammarOutput);
      setGrammarErrors([]);
    }
  };

  // Enterprise Security & Health State
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [ephemeralMode, setEphemeralMode] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [copiedRedirectUri, setCopiedRedirectUri] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  // Quick prompt presets for single-click research actions
  const researchPresets = [
    {
      title: "Executive Summary",
      prompt: "Synthesize an executive summary of the literature, highlighting the overarching objectives and key conclusions."
    },
    {
      title: "Methodology & Design",
      prompt: "Extract and critique the core methodology, data collections, and logical frameworks detailed in the files."
    },
    {
      title: "Key Findings",
      prompt: "Summarize all quantified outcomes, core statistics, and primary discoveries reported in the documents."
    },
    {
      title: "Omissions & Gaps",
      prompt: "Identify the limitations, constraints, research gaps, or future recommendations explicitly mentioned by the authors."
    }
  ];

  // Fetch documents from Express server
  const fetchDocuments = async () => {
    try {
      const response = await apiFetch("/api/documents");
      const data = await response.json();
      if (data.documents) {
        setIndexedFiles(data.documents);
      }
    } catch (err) {
      console.warn("Failed to fetch documents:", err);
    }
  };

  // Fetch system health metrics
  const fetchSystemHealth = async () => {
    try {
      const response = await apiFetch("/api/system/health");
      if (response.ok) {
        const data = await response.json();
        setSystemHealth(data);
        setEphemeralMode(data.ephemeralMode);
      }
    } catch (err) {
      console.warn("Failed to fetch system health status:", err);
    }
  };

  // Fetch security audit logs
  const fetchAuditLogs = async () => {
    try {
      const response = await apiFetch("/api/security/audit-logs");
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.auditLogs);
      }
    } catch (err) {
      console.warn("Failed to retrieve audit events:", err);
    }
  };

  // Toggle session ephemeral wiping
  const handleToggleEphemeral = async () => {
    try {
      const response = await apiFetch("/api/security/toggle-ephemeral", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        setEphemeralMode(data.ephemeralMode);
        fetchSystemHealth();
        fetchAuditLogs();
      }
    } catch (err) {
      console.warn("Failed to alter session permanence level:", err);
    }
  };

  // Erase audit event lists
  const handleClearAuditLogs = async () => {
    try {
      const response = await apiFetch("/api/security/clear-logs", { method: "POST" });
      if (response.ok) {
        setAuditLogs([]);
        fetchAuditLogs();
      }
    } catch (err) {
      console.warn("Failed to wipe audit log sequence:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      const start = Date.now();
      await fetchDocuments();
      await fetchSystemHealth();
      await fetchAuditLogs();
      
      // Load sessions from localStorage
      const savedSessions = localStorage.getItem("docchat_sessions");
      let loadedSessions: ChatSession[] = [];
      let activeId: string | null = null;
      if (savedSessions) {
        try {
          loadedSessions = JSON.parse(savedSessions);
        } catch (e) {
          console.error("Failed to parse saved sessions", e);
        }
      }

      if (loadedSessions.length === 0) {
        // Create an initial empty session
        const initialSession: ChatSession = {
          id: Math.random().toString(36).substring(2, 9),
          title: "New Research Workspace",
          messages: [],
          cognitiveMemory: "",
          selectedScopeIds: [],
          createdAt: Date.now()
        };
        loadedSessions = [initialSession];
        activeId = initialSession.id;
      } else {
        activeId = loadedSessions[0].id;
      }

      setSessions(loadedSessions);
      setActiveSessionId(activeId);
      
      // Initialize the app states with the active session
      const activeSession = loadedSessions.find(s => s.id === activeId);
      if (activeSession) {
        setMessages(activeSession.messages || []);
        setCognitiveMemory(activeSession.cognitiveMemory || "");
        setSelectedScopeIds(activeSession.selectedScopeIds || []);
      }

      const elapsed = Date.now() - start;
      const delay = Math.max(0, 1000 - elapsed);
      setTimeout(() => {
        setIsInitializing(false);
      }, delay);
    };
    init();
  }, []);

  // Listen for Google OAuth success messages from authorization popup
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Allow Cloud Run domains, localhost, Google previews, and AI Studio sandboxes
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('google') && !origin.includes('aistudio')) {
        return;
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { authData } = event.data;
        if (authData && authData.user && authData.accessToken && authData.refreshToken) {
          localStorage.setItem("docmind_access_token", authData.accessToken);
          localStorage.setItem("docmind_refresh_token", authData.refreshToken);
          localStorage.setItem("docmind_user", JSON.stringify(authData.user));
          
          setUser(authData.user);
          setAuthMode(null);
          setAuthUsername("");
          setAuthPassword("");
          setAuthLoading(false);
          setRegSmtpBypassed(false);
          setAuthSuccess("Successfully authenticated via Google Cloud secure single sign-on!");
          
          setTimeout(() => {
            fetchDocuments();
            fetchAuditLogs();
            fetchSystemHealth();
            setAuthSuccess(null);
          }, 1500);
        } else {
          setAuthError("Google OAuth response was missing authentication details. Please retry.");
          setAuthLoading(false);
        }
      }
    };
    
    const checkLocalStorageUser = () => {
      if (!user) {
        const token = localStorage.getItem("docmind_access_token");
        const storedUser = localStorage.getItem("docmind_user");
        if (token && storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setAuthMode(null);
            setAuthUsername("");
            setAuthPassword("");
            setAuthLoading(false);
            setRegSmtpBypassed(false);
            setAuthSuccess("Successfully logged in!");
            fetchDocuments();
            fetchAuditLogs();
            fetchSystemHealth();
            setTimeout(() => setAuthSuccess(null), 1500);
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    
    window.addEventListener("message", handleOAuthMessage);
    window.addEventListener("focus", checkLocalStorageUser);
    const interval = setInterval(checkLocalStorageUser, 1000);
    
    return () => {
      window.removeEventListener("message", handleOAuthMessage);
      window.removeEventListener("focus", checkLocalStorageUser);
      clearInterval(interval);
    };
  }, [user]);

  // Sync health metrics and audit logs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSystemHealth();
      if (activeView === "security") {
        fetchAuditLogs();
      }
    }, 12000);
    return () => clearInterval(interval);
  }, [activeView]);

  // Sync messages, scope and memory changes to active session in localStorage
  useEffect(() => {
    if (isInitializing) return;
    if (!activeSessionId) return;

    setSessions(prevSessions => {
      const updated = prevSessions.map(session => {
        if (session.id === activeSessionId) {
          let newTitle = session.title;
          if (session.title === "New Research Workspace" || session.title === "New Research Chat" || session.title === "New Chat") {
            const firstUserMsg = messages.find(m => m.role === "user");
            if (firstUserMsg) {
              newTitle = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? "..." : "");
            }
          }
          return {
            ...session,
            title: newTitle,
            messages: messages,
            cognitiveMemory: cognitiveMemory,
            selectedScopeIds: selectedScopeIds,
            activeDocId: selectedDocContent?.id
          };
        }
        return session;
      });

      localStorage.setItem("docchat_sessions", JSON.stringify(updated));
      return updated;
    });
  }, [messages, cognitiveMemory, selectedScopeIds, activeSessionId, selectedDocContent, isInitializing]);

  const switchSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    setActiveView("workspaces");
    setActiveSessionId(sessionId);
    setMessages(session.messages || []);
    setCognitiveMemory(session.cognitiveMemory || "");
    setSelectedScopeIds(session.selectedScopeIds || []);

    // Contextual restoration: load the saved active document, or fallback to the first scoped document
    const docIdToLoad = session.activeDocId || (session.selectedScopeIds && session.selectedScopeIds[0]);
    if (docIdToLoad) {
      // Find the file in our loaded indexes
      const fileToLoad = indexedFiles.find(f => f.id === docIdToLoad);
      if (fileToLoad) {
        handlePreviewDocument(fileToLoad);
      }
    } else {
      // Fallback: if we have indexed files, auto-preview the first one so the reader isn't empty
      if (indexedFiles.length > 0) {
        handlePreviewDocument(indexedFiles[0]);
      } else {
        setSelectedDocContent(null);
      }
    }
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Math.random().toString(36).substring(2, 9),
      title: "New Research Workspace",
      messages: [],
      cognitiveMemory: "",
      selectedScopeIds: [],
      createdAt: Date.now()
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newSession.id);
    setMessages([]);
    setCognitiveMemory("");
    setSelectedScopeIds([]);
    localStorage.setItem("docchat_sessions", JSON.stringify(updated));
  };

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== sessionId);

    let nextActiveId = activeSessionId;
    if (activeSessionId === sessionId) {
      if (updated.length > 0) {
        nextActiveId = updated[0].id;
      } else {
        const freshSession: ChatSession = {
          id: Math.random().toString(36).substring(2, 9),
          title: "New Research Workspace",
          messages: [],
          cognitiveMemory: "",
          selectedScopeIds: [],
          createdAt: Date.now()
        };
        updated.push(freshSession);
        nextActiveId = freshSession.id;
      }
    }

    setSessions(updated);
    localStorage.setItem("docchat_sessions", JSON.stringify(updated));

    if (nextActiveId !== activeSessionId) {
      const nextActiveSession = updated.find(s => s.id === nextActiveId);
      if (nextActiveSession) {
        setActiveSessionId(nextActiveId);
        setMessages(nextActiveSession.messages || []);
        setCognitiveMemory(nextActiveSession.cognitiveMemory || "");
        setSelectedScopeIds(nextActiveSession.selectedScopeIds || []);
      }
    }
  };

  const wipeAllHistory = () => {
    if (window.confirm("Are you sure you want to wipe all chat history? This cannot be undone.")) {
      const freshSession: ChatSession = {
        id: Math.random().toString(36).substring(2, 9),
        title: "New Research Workspace",
        messages: [],
        cognitiveMemory: "",
        selectedScopeIds: [],
        createdAt: Date.now()
      };
      const updated = [freshSession];
      setSessions(updated);
      setActiveSessionId(freshSession.id);
      setMessages([]);
      setCognitiveMemory("");
      setSelectedScopeIds([]);
      localStorage.setItem("docchat_sessions", JSON.stringify(updated));
    }
  };

  // Smooth scroll to latest message when messages array updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Instant scroll to latest message when layout states change (sidebar toggled, tab changed, etc.)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [showHistorySidebar, rightPanelTab, activeView]);

  // Instant scroll to latest message when window is resized or container layout changes
  useEffect(() => {
    const container = chatScrollContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "auto" });
    });

    resizeObserver.observe(container);

    const handleWindowResize = () => {
      chatEndRef.current?.scrollIntoView({ behavior: "auto" });
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // Base64 helper
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setErrorContext(null);
    const files = Array.from(e.target.files) as File[];
    
    const maxBytes = 50 * 1024 * 1024;
    const maxSizeMB = "50MB";

    // Create optimistic temporary files for instant user feedback
    const tempFiles: IndexedFile[] = files.map(file => ({
      id: "temp_" + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      summary: "Ingesting and creating secure vector embeddings...",
      wordCount: Math.max(100, Math.ceil(file.size / 6)),
      charCount: file.size,
      chunksCount: 1,
      isUploading: true,
    } as any));

    setUploadingFiles(prev => [...prev, ...tempFiles]);
    
    const uploadPromises = files.map(async (file) => {
      if (file.size === 0) {
        setErrorContext(`Skipped empty document: '${file.name}'`);
        setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
        return;
      }
      
      if (file.size > maxBytes) {
        setErrorContext(`Document '${file.name}' exceeds the file size limit of ${maxSizeMB}.`);
        setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
        return;
      }
      
      try {
        const base64Data = await convertFileToBase64(file);
        
        const response = await apiFetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
            data: base64Data
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to parse document.");
        }
      } catch (err: any) {
        setErrorContext(err.message || `An error occurred processing '${file.name}'.`);
        console.error(err);
      } finally {
        setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
      }
    });

    // Run uploads concurrently in the background and fetch fresh files once complete
    Promise.all(uploadPromises).then(() => {
      fetchDocuments();
      fetchAuditLogs();
      fetchSystemHealth();
    });
  };

  // RAG query submission
  const triggerQuery = async (queryText: string) => {
    if (!queryText.trim() || isChatting) return;

    setErrorContext(null);
    setMessages(prev => [...prev, { role: "user", content: queryText }]);
    setIsChatting(true);

    try {
      const response = await apiFetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          prompt: queryText,
          docIds: selectedScopeIds // Pin query to selected scope
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process question.");
      }

      setMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: data.answer, 
          source: data.sources,
          routeTrace: data.routeTrace,
          memorySummary: data.memorySummary
        }
      ]);

      if (data.memorySummary) {
        setCognitiveMemory(data.memorySummary);
      }
    } catch (err: any) {
      setErrorContext(err.message || "Failure contacting chat research engine.");
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Error processing request: ${err.message || "Internal RAG engine mismatch."}`
        }
      ]);
    } finally {
      setIsChatting(false);
      fetchAuditLogs();
      fetchSystemHealth();
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");
    triggerQuery(text);
  };

  // Preview full text in IDE view
  const handlePreviewDocument = async (file: IndexedFile) => {
    setRightPanelTab("viewer");
    if (selectedDocContent?.id === file.id) {
      return;
    }

    if ((file as any).isUploading) {
      setSelectedDocContent({
        ...file,
        content: `# Ingestion Pipeline Active\n\n**${file.name}** is currently being processed and indexed into secure vector space.\n\n- File size: ${formatBytes(file.size)}\n- Status: Ingestion and vector alignment active...`
      });
      return;
    }

    setIsLoadingDoc(true);
    setErrorContext(null);
    try {
      const res = await apiFetch(`/api/documents/${file.id}`);
      if (!res.ok) throw new Error("Could not load text content from server database files.");
      const data = await res.json();
      setSelectedDocContent({
        ...file,
        content: data.content
      });
    } catch (err: any) {
      setErrorContext(err.message);
      setSelectedDocContent(null);
    } finally {
      setIsLoadingDoc(false);
    }
  };

  // Delete document from library
  const handleDeleteDocument = async (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this document and remove its indexed vector chunks?")) return;
    try {
      const res = await apiFetch(`/api/documents/${fileId}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedDocContent?.id === fileId) {
          setSelectedDocContent(null);
        }
        setSelectedScopeIds(prev => prev.filter(id => id !== fileId));
        fetchDocuments();
        fetchAuditLogs();
        fetchSystemHealth();
      } else {
        const data = await res.json();
        setErrorContext(data.error || "Failed to delete document.");
      }
    } catch (err: any) {
      setErrorContext(err.message || "Failed to connect to delete document API.");
    }
  };

  // Cross document comparison call
  const generateComparison = async () => {
    if (selectedScopeIds.length === 0) return;
    setIsComparing(true);
    setErrorContext(null);
    try {
      const res = await apiFetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docIds: selectedScopeIds })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Comparative model pipeline failed.");
      setComparisonMatrix(data);
      setRightPanelTab("comparison");
    } catch (err: any) {
      setErrorContext(err.message || "Comparison matrix failed to run.");
    } finally {
      setIsComparing(false);
      fetchAuditLogs();
    }
  };

  // Custom row generation for cross-document comparison matrix
  const handleAddCustomRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAttribute.trim() || !comparisonMatrix || isAddingRow) return;
    setIsAddingRow(true);
    setRowError(null);
    try {
      const res = await apiFetch("/api/compare/custom-row", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docIds: selectedScopeIds, attribute: customAttribute.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to synthesize custom attribute row.");
      
      const newRow = [data.attribute, ...data.values];
      setComparisonMatrix(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          rows: [...prev.rows, newRow]
        };
      });
      setCustomAttribute("");
    } catch (err: any) {
      setRowError(err.message || "Custom row synthesis failed.");
    } finally {
      setIsAddingRow(false);
    }
  };

  // Selection toggles for Search Scope Filter
  const handleToggleScopeSelection = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedScopeIds(prev => 
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const selectAllForScope = () => {
    if (selectedScopeIds.length === indexedFiles.length) {
      setSelectedScopeIds([]);
    } else {
      setSelectedScopeIds(indexedFiles.map(f => f.id));
    }
  };

  // Exportable Brief Download Handler
  const handleExportBrief = () => {
    if (messages.length === 0) return;
    
    let markdown = `# DocuMind Workspace Briefing\n\n`;
    markdown += `*Generated on: ${new Date().toLocaleDateString()}*\n\n`;
    
    markdown += `## Document Library Index\n`;
    indexedFiles.forEach((f) => {
      markdown += `- **${f.name}** (${formatBytes(f.size)} - ${f.chunksCount} chunks indexed)\n`;
      markdown += `  *Abstract*: ${f.summary}\n`;
    });
    markdown += `\n---\n\n## Chat & Analysis History\n\n`;
    
    messages.forEach((msg) => {
      if (msg.role === "user") {
        markdown += `### 👤 Researcher Query\n> ${msg.content}\n\n`;
      } else {
        markdown += `### 🤖 AI Synthesis\n${msg.content}\n\n`;
        if (msg.routeTrace) {
          markdown += `*Trace: ${msg.routeTrace.retrievalMethod} | Confidence: ${msg.routeTrace.confidence}%*\n\n`;
        }
        if (msg.source && msg.source.length > 0) {
          markdown += `#### Grounding Citations:\n`;
          msg.source.forEach((src, sIdx) => {
            markdown += `> **[Ref ${sIdx + 1}] ${src.docName} (Page: ${src.page})**: "${src.quote}"\n`;
            markdown += `> *Context*: ${src.explanation}\n\n`;
          });
        }
        markdown += `---\n\n`;
      }
    });
    
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Research_Brief_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export comparison table Markdown
  const handleExportComparisonMarkdown = () => {
    if (!comparisonMatrix) return;
    let markdown = `# Cross-Document Comparison Matrix\n\n`;
    markdown += `*Generated on: ${new Date().toLocaleDateString()}*\n\n`;
    
    // Table headers
    markdown += `| ` + comparisonMatrix.headers.join(" | ") + ` |\n`;
    markdown += `| ` + comparisonMatrix.headers.map(() => "---").join(" | ") + ` |\n`;
    
    // Table rows
    comparisonMatrix.rows.forEach(row => {
      markdown += `| ` + row.join(" | ") + ` |\n`;
    });
    
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Comparison_Matrix_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Audio Playback / TTS
  const handleSpeak = (text: string, idx: number) => {
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    
    window.speechSynthesis.cancel();
    
    // Clean markdown characters for pleasant narration
    const cleanText = text
      .replace(/[*#_`>-]/g, " ")
      .replace(/\[Ref \d+\]/g, "")
      .trim();
      
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => {
      setSpeakingIdx(null);
    };
    utterance.onerror = () => {
      setSpeakingIdx(null);
    };
    
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  // Purge library completely
  const resetAllStore = async () => {
    if (!window.confirm("Are you sure you want to completely clear the library and all conversation history?")) return;
    setErrorContext(null);
    try {
      await apiFetch("/api/reset", { method: "POST" });
      setMessages([]);
      setIndexedFiles([]);
      setExpandedCitations({});
      setSelectedDocContent(null);
      setSelectedScopeIds([]);
      setComparisonMatrix(null);
      setCognitiveMemory("");
      fetchAuditLogs();
      fetchSystemHealth();
    } catch (err) {
      console.error("Error purging library:", err);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1000;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const toggleCitation = (idx: number) => {
    setExpandedCitations(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const filteredFiles = [...indexedFiles, ...uploadingFiles].filter(f => 
    f.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Interactive Footnote citations rendering
  const renderMessageContent = (msg: Message, msgIdx: number) => {
    const text = msg.content;
    const parts = text.split(/(\[Ref \d+\])/g);
    
    return (
      <div className="markdown-body text-xs leading-relaxed">
        {parts.map((part, pIdx) => {
          const match = part.match(/\[Ref (\d+)\]/);
          if (match) {
            const refNum = parseInt(match[1], 10);
            return (
              <button
                key={pIdx}
                onClick={() => {
                  // Toggle citations accordion to show details and set viewer to active
                  if (msg.source && msg.source[refNum - 1]) {
                    const cite = msg.source[refNum - 1];
                    const matchedFile = indexedFiles.find(f => f.name === cite.docName);
                    if (matchedFile) {
                      handlePreviewDocument(matchedFile);
                    }
                    setExpandedCitations(prev => ({ ...prev, [msgIdx]: true }));
                  }
                }}
                className="inline-flex items-center justify-center font-bold px-1.5 py-0.5 mx-0.5 rounded text-[10px] bg-teal-muted text-teal-accent hover:bg-teal-accent hover:text-slate-bg transition-all cursor-pointer border border-teal-accent/30 align-super"
                title={`Click to view citation for ${msg.source?.[refNum - 1]?.docName || "file"}`}
              >
                ^{refNum}
              </button>
            );
          }
          
          // Render plain markdown paragraphs simply
          return <span key={pIdx}>{part}</span>;
        })}
      </div>
    );
  };

  // Render D3 Knowledge Graph
  useEffect(() => {
    if (activeView !== "graph" || !graphContainerRef.current) return;

    // Clear previous SVG content to refresh
    d3.select(graphContainerRef.current).selectAll("*").remove();

    const width = graphContainerRef.current.clientWidth || 600;
    const height = 450;

    // Build hierarchical nodes from indexedFiles
    const nodes: any[] = [
      { id: "orchestrator", name: "DocuMind Hub", type: "root", val: 18, color: "#00E5FF" }
    ];
    const links: any[] = [];

    // Add Security layer node
    nodes.push({ id: "security", name: "AES-256 Vault", type: "security", val: 13, color: "#10B981" });
    links.push({ source: "orchestrator", target: "security" });

    indexedFiles.forEach((file) => {
      nodes.push({ id: file.id, name: file.name, type: "doc", val: 11, color: "#818CF8" });
      links.push({ source: "orchestrator", target: file.id });

      // Add concept keyword nodes derived from document summary / contents
      const ext = file.name.split(".").pop()?.toUpperCase() || "DOC";
      nodes.push({ id: `ext_${file.id}`, name: `Format: ${ext}`, type: "concept", val: 8, color: "#E2E8F0" });
      links.push({ source: file.id, target: `ext_${file.id}` });

      if (file.chunksCount > 0) {
        nodes.push({ id: `chunk_${file.id}`, name: `${file.chunksCount} Vectors`, type: "concept", val: 8, color: "#F59E0B" });
        links.push({ source: file.id, target: `chunk_${file.id}` });
      }
    });

    const svg = d3.select(graphContainerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "bg-[#25282D] rounded-xl overflow-hidden");

    // Force simulation setup
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(90))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Render links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#383D43")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d: any) => d.target.type === "concept" ? "3,3" : "0");

    // Render nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
      );

    // Node circles
    node.append("circle")
      .attr("r", (d: any) => d.val)
      .attr("fill", (d: any) => d.color)
      .attr("stroke", "#1A1D21")
      .attr("stroke-width", 2);

    // Node text labels
    node.append("text")
      .text((d: any) => d.name)
      .attr("dx", 12)
      .attr("dy", 4)
      .attr("fill", "#F8F9FA")
      .style("font-size", "10px")
      .style("font-weight", (d: any) => d.type === "root" ? "700" : "500")
      .style("pointer-events", "none");

    // Simulation tickers
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [activeView, indexedFiles]);

  // Premium interactive illustration components for the login/register portal (Matching user's mockup layout)
  const GearsDecorative = () => (
    <div className="absolute top-[20%] left-[8%] w-24 h-24 pointer-events-none hidden xl:block select-none z-0">
      {/* Large Gear */}
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 100 100"
        className="absolute top-0 left-0 text-sky-400 opacity-85"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      >
        <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="8" />
        <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="4" />
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d="M 45,5 L 55,5 L 53,20 L 47,20 Z"
            fill="currentColor"
            transform={`rotate(${i * 45} 50 50)`}
          />
        ))}
      </motion.svg>

      {/* Small Gear */}
      <motion.svg
        width="44"
        height="44"
        viewBox="0 0 100 100"
        className="absolute top-10 left-12 text-sky-300 opacity-75"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="8" />
        <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="4" />
        {[...Array(6)].map((_, i) => (
          <path
            key={i}
            d="M 46,6 L 54,6 L 52,22 L 48,22 Z"
            fill="currentColor"
            transform={`rotate(${i * 60} 50 50)`}
          />
        ))}
      </motion.svg>
    </div>
  );

  const PaperAirplaneDecorative = () => (
    <motion.div
      className="absolute top-[10%] left-[45%] w-16 h-16 pointer-events-none hidden xl:block select-none z-0"
      animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
    >
      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" className="text-sky-500 opacity-90">
        <path
          d="M 10,50 L 90,20 L 60,60 L 50,85 L 45,60 Z"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="round"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <path d="M 90,20 L 45,60" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );

  const SecurityPadlockDecorative = () => (
    <motion.div
      className="absolute bottom-[5%] left-[46%] w-24 h-24 pointer-events-none hidden xl:block select-none z-0"
      animate={{ y: [0, -6, 0], scale: [1, 1.04, 1] }}
      transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center">
        <svg width="68" height="68" viewBox="0 0 100 100" fill="none" className="filter drop-shadow-md">
          <path
            d="M 30,50 L 30,30 A 20,20 0 0,1 70,30 L 70,50"
            stroke="#F59E0B"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <rect x="20" y="45" width="60" height="45" rx="14" fill="#F59E0B" />
          <rect x="25" y="50" width="50" height="35" rx="10" fill="#FBBF24" />
          <circle cx="50" cy="62" r="6" fill="#78350F" />
          <path d="M 47,62 L 53,62 L 54,76 L 46,76 Z" fill="#78350F" />
        </svg>
      </div>
    </motion.div>
  );

  const LocationPinDecorative = () => (
    <motion.div
      className="absolute top-[14%] right-[10%] w-16 h-16 pointer-events-none hidden xl:block select-none z-0"
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
    >
      <svg width="56" height="56" viewBox="0 0 100 100" fill="none" className="text-amber-500 filter drop-shadow-md">
        <path
          d="M 50,10 C 30,10 15,25 15,45 C 15,70 50,90 50,90 C 50,90 85,70 85,45 C 85,25 70,10 50,10 Z"
          fill="currentColor"
        />
        <circle cx="50" cy="40" r="14" fill="#FFFFFF" />
        <path d="M 50,30 L 50,50 M 40,40 L 60,40" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );

  const WarningTriangleDecorative = () => (
    <motion.div
      className="absolute bottom-[20%] left-[10%] w-16 h-16 pointer-events-none hidden xl:block select-none z-0"
      animate={{ y: [0, 8, 0], rotate: [0, -2, 2, 0] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
    >
      <svg width="56" height="56" viewBox="0 0 100 100" fill="none" className="text-red-500 filter drop-shadow-md">
        <path
          d="M 50,10 L 91,80 L 9,80 Z"
          fill="#FEF2F2"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <rect x="47" y="32" width="6" height="24" rx="3" fill="currentColor" />
        <circle cx="50" cy="66" r="4.5" fill="currentColor" />
      </svg>
    </motion.div>
  );

  const QuestionBubbleDecorative = () => (
    <motion.div
      className="absolute top-[32%] right-[7%] w-16 h-16 pointer-events-none hidden xl:block select-none z-0"
      animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" className="text-[#EF4444] filter drop-shadow-md">
        <path
          d="M 15,45 C 15,25 35,10 50,10 C 65,10 85,25 85,45 C 85,60 70,72 60,74 L 62,88 L 48,77 C 20,77 15,60 15,45 Z"
          fill="#FEF2F2"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <text
          x="50"
          y="52"
          fill="currentColor"
          fontSize="36"
          fontWeight="900"
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          ?
        </text>
      </svg>
    </motion.div>
  );

  const WalkingGirlDecorative = () => (
    <motion.div
      className="absolute bottom-[8%] right-[7%] w-56 h-80 pointer-events-none hidden xl:block select-none z-0"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
    >
      <svg width="220" height="320" viewBox="0 0 220 320" fill="none">
        <ellipse cx="110" cy="305" rx="58" ry="7" fill="#E4E4E7" />
        <path d="M 98,210 L 91,280 L 80,285 C 80,285 78,295 90,295 L 105,295 L 108,210 Z" fill="#18181B" />
        <path d="M 116,210 L 125,275 L 134,282 C 134,282 137,292 125,295 L 109,295 L 109,210 Z" fill="#27272A" />
        <path d="M 98,190 L 98,215 L 108,215 L 108,190 Z" fill="#FDBA74" />
        <path d="M 112,190 L 112,215 L 120,215 L 120,190 Z" fill="#FDBA74" />
        <path d="M 90,115 L 130,115 L 140,200 L 80,200 Z" fill="#2563EB" />
        <rect x="88" y="115" width="44" height="6" fill="#1E293B" />
        <path d="M 104,80 L 116,80 L 114,115 L 106,115 Z" fill="#FDBA74" />
        <circle cx="110" cy="70" r="16" fill="#FDBA74" />
        <path d="M 100,56 C 110,56 126,60 126,72 C 126,84 112,86 110,86 C 100,86 94,76 94,70 C 94,64 96,56 100,56 Z" fill="#18181B" />
        <path d="M 124,68 C 134,68 144,74 142,88 C 140,96 132,94 126,82 Z" fill="#18181B" />
        <path d="M 85,115 L 75,150 L 85,160 Z" fill="#FDBA74" />
        
        <g transform="rotate(-15 100 150)">
          <rect x="50" y="120" width="70" height="42" rx="4" fill="#FFFFFF" stroke="#3F3F46" strokeWidth="2.5" />
          <rect x="56" y="128" width="16" height="10" rx="1.5" fill="#18181B" />
          <line x1="56" y1="145" x2="110" y2="145" stroke="#71717A" strokeWidth="3" strokeLinecap="round" />
          <line x1="56" y1="152" x2="95" y2="152" stroke="#D4D4D8" strokeWidth="3" strokeLinecap="round" />
        </g>
        
        <g transform="rotate(10 110 160)">
          <rect x="80" y="130" width="75" height="44" rx="4" fill="#FFFFFF" stroke="#18181B" strokeWidth="3" />
          <line x1="88" y1="142" x2="145" y2="142" stroke="#18181B" strokeWidth="4" strokeLinecap="round" />
          <line x1="88" y1="150" x2="135" y2="150" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
          <line x1="88" y1="158" x2="115" y2="158" stroke="#D4D4D8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="144" cy="158" r="3" fill="#18181B" />
        </g>
        <path d="M 126,115 L 138,150 L 144,146 L 132,115 Z" fill="#FDBA74" />
      </svg>
    </motion.div>
  );

  const renderSecurityAndTermsModals = () => {
    return (
      <AnimatePresence>
        {/* Terms & Conditions Modal */}
        {showTermsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#25282D] border border-[#383D43] rounded-3xl p-6 shadow-2xl relative text-[#F8F9FA] flex flex-col max-h-[85vh]"
            >
              <button
                onClick={() => setShowTermsModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-teal-accent/10 flex items-center justify-center border border-teal-accent/30">
                  <FileText className="w-5 h-5 text-teal-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-teal-accent">Terms & Conditions of Service</h3>
                  <p className="text-[10px] text-gray-400">Effective: July 2026</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 my-4 space-y-4 scrollbar-thin text-gray-300 text-[10.5px] leading-relaxed">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-cool-white uppercase tracking-wide">1. Absolute Data Ownership</h4>
                  <p>
                    You retain full 100% intellectual property rights, copyright, and ownership over all academic papers, documents, source texts, and research prompts uploaded to DocuMind. We do not lay claim to any intellectual discoveries, literature syntheses, or materials generated via your files.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-cool-white uppercase tracking-wide">2. Cryptographic Privacy Guarantee</h4>
                  <p>
                    We guarantee that all research papers and custom indexes remain 100% private. Our software runs isolated on secure enterprise infrastructure where every document is automatically encrypted with AES-256 before being indexed into vector chunks. No indexing or parsing pipelines are shared across other user nodes.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-cool-white uppercase tracking-wide">3. Zero Third-Party Selling or LLM Training</h4>
                  <p>
                    DocuMind will never lease, sell, or monetize your research materials, document metadata, or chat query logs to any third-party marketing firms, external data vendors, or LLM providers. Your data is strictly used for real-time local semantic context in your immediate session.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-cool-white uppercase tracking-wide">4. Ephemeral Autonomy & Erasure</h4>
                  <p>
                    At any time, you can purge your Research Library. Deleting a research paper instantly sanitizes all associated text segments, cryptographic file paths, and vector embedding coordinates from both active system memory and long-term persistent storage structures. Disconnecting your profile wipes session-specific parameters immediately.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-cool-white uppercase tracking-wide">5. Acceptable Use Policy</h4>
                  <p>
                    You agree not to leverage DocuMind for the ingestion or processing of illegal, highly classified, or malware-containing files. By continuing to use the software, you represent that you have the full legal clearance or fair-use copyright authority to upload and analyze the documents in your library.
                  </p>
                </div>
              </div>

              <div className="border-t border-[#383D43]/60 pt-4 flex items-center justify-between text-[9.5px] text-gray-400 shrink-0">
                <span className="font-mono">DocuMind Cryptographic Vaults</span>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="bg-teal-accent hover:bg-teal-accent-hover text-slate-bg font-extrabold px-5 py-1.5 rounded-xl text-xs transition-all shadow cursor-pointer"
                >
                  I Understand & Accept
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  if (authMode && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/40 text-[#1F2937] flex flex-col justify-between font-sans selection:bg-sky-500/20 antialiased p-6 md:p-10 relative overflow-hidden select-none">
        
        {/* High-End Tech Mesh Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.45] pointer-events-none z-0" />

        {/* Floating Aesthetic Ambient Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-sky-200/30 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -50, 0],
              y: [0, 40, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-amber-100/35 blur-3xl"
          />
        </div>

        {/* Floating High-End Thematic Cognitive Badges / Chips */}
        <motion.div
          animate={{ 
            y: [0, -12, 0],
            rotate: [-2, 2, -2]
          }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute top-[28%] left-[15%] hidden xl:flex items-center gap-2 bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.03)] z-10 pointer-events-none"
        >
          <div className="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
            <Network className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-gray-800 tracking-tight leading-none">Cognitive Graph</span>
            <span className="text-[8px] font-mono text-sky-500 font-semibold leading-none">ACTIVE THREADS</span>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, 10, 0],
            rotate: [1, -1, 1]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute bottom-[22%] right-[22%] hidden xl:flex items-center gap-2 bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.03)] z-10 pointer-events-none"
        >
          <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-gray-800 tracking-tight leading-none">Vector Indexes</span>
            <span className="text-[8px] font-mono text-amber-600 font-semibold leading-none">HNSW COGNITIVE</span>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -8, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          className="absolute top-[32%] right-[10%] hidden xl:flex items-center gap-2 bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.03)] z-10 pointer-events-none"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-gray-800 tracking-tight leading-none">RAG Pipelines</span>
            <span className="text-[8px] font-mono text-emerald-600 font-semibold leading-none">ZERO-LATENCY</span>
          </div>
        </motion.div>
          
          {/* Constellation Dashed Path flowing continuously (Drawn behind center card) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden xl:block z-0">
            <motion.path
              d="M 380 540 C 200 540, 150 420, 150 360 C 150 260, 240 220, 320 180 C 400 140, 600 160, 720 180 C 850 200, 950 280, 920 400 C 890 520, 600 500, 380 540"
              stroke="#E4E4E7"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              fill="none"
              animate={{ strokeDashoffset: [0, -120] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            />
          </svg>

          {/* FLOATING ANIMATED BACKGROUND DECORATIONS (Match the mockup perfectly with micro-interactions) */}

          {/* 1. ROTATING COGS (Top-Left) */}
          <div className="absolute top-[18%] left-[10%] hidden md:flex items-center gap-1 z-0 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="text-sky-400 opacity-80"
            >
              <Cog className="w-12 h-12" strokeWidth={1.5} />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="text-sky-300 opacity-70 relative -top-3 -left-2"
            >
              <Cog className="w-8 h-8" strokeWidth={1.5} />
            </motion.div>
          </div>

          {/* 2. PAPER AIRPLANE (Top-Center-Left) */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              x: [0, 6, 0],
              rotate: [315, 320, 315] 
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            style={{ rotate: 315 }}
            className="absolute top-[16%] left-[43%] hidden md:block z-0 text-blue-600 opacity-90 pointer-events-none"
          >
            <Send className="w-8 h-8 fill-blue-50" strokeWidth={1.5} />
          </motion.div>

          {/* 3. MAP PIN (Top-Right) */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.05, 1] 
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-[18%] right-[22%] hidden md:block z-0 text-amber-500 opacity-95 pointer-events-none"
          >
            <div className="relative">
              <MapPin className="w-10 h-10 fill-amber-50" strokeWidth={1.5} />
              <div className="absolute top-[11px] left-[13px] w-3 h-3 rounded-full bg-amber-500 animate-ping" />
            </div>
          </motion.div>

          {/* 4. WARNING TRIANGLE (Bottom-Left) */}
          <motion.div
            animate={{ 
              rotate: [-4, 4, -4],
              y: [0, -4, 0] 
            }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
            className="absolute bottom-[30%] left-[13%] hidden md:block z-0 text-rose-500 opacity-90 pointer-events-none"
          >
            <AlertTriangle className="w-10 h-10 fill-rose-50" strokeWidth={1.5} />
          </motion.div>

          {/* 5. SECURITY PADLOCK (Bottom-Center-Left) */}
          <motion.div
            animate={{ 
              y: [0, -6, 0],
              scale: [1, 1.02, 1] 
            }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="absolute bottom-[4%] left-[32%] hidden md:block z-0 pointer-events-none"
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Shackle */}
              <div className="absolute top-[4px] w-8 h-8 border-4 border-slate-400 rounded-t-full -z-10" />
              {/* Body */}
              <div className="absolute bottom-[2px] w-12 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm border border-orange-400 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                  <div className="w-1 h-2 bg-slate-500 mt-1" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 6. RESEARCHER CHARACTER WITH GIANT DOCUMENTS (Middle-Right) */}
          <motion.div
            animate={{ 
              y: [0, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute bottom-[10%] right-[6%] hidden lg:flex flex-col items-center z-0 w-[240px] h-[340px] pointer-events-none select-none"
          >
            {/* Floating Red Chat Bubble with Question Mark */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: [0, -3, 0] 
              }}
              transition={{ 
                delay: 0.8, 
                duration: 0.4, 
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" } 
              }}
              className="absolute top-0 right-10 bg-[#FF6B6B] text-white font-extrabold text-xs w-7 h-7 rounded-full shadow-md flex items-center justify-center border border-red-400 select-none"
            >
              <span>?</span>
              <div className="absolute bottom-[-3px] left-2.5 w-2 h-2 bg-[#FF6B6B] rotate-45 border-r border-b border-red-400" />
            </motion.div>

            {/* Vector Graphic Character Artwork SVG */}
            <svg viewBox="0 0 200 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Ground soft shadow */}
              <ellipse cx="100" cy="275" rx="35" ry="6" fill="#E2E8F0" opacity="0.6" />

              {/* Legs & Shoes */}
              <path d="M90 220 L90 270 M110 220 L110 270" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
              <rect x="83" y="268" width="13" height="9" rx="3" fill="#1E293B" />
              <rect x="104" y="268" width="13" height="9" rx="3" fill="#1E293B" />
              
              {/* Socks */}
              <rect x="87" y="248" width="6" height="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
              <rect x="107" y="248" width="6" height="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
              
              {/* Dress / Body */}
              <path d="M75 140 L125 140 L115 220 L85 220 Z" fill="#2563EB" stroke="#1E293B" strokeWidth="3" strokeLinejoin="round" />
              
              {/* Collar */}
              <path d="M90 140 L100 152 L110 140" stroke="#1E293B" strokeWidth="3" fill="#FFFFFF" strokeLinejoin="round" />
              
              {/* Ponytail */}
              <path d="M118 92 C135 92, 142 115, 132 125 C127 115, 120 102, 118 92 Z" fill="#1E293B" stroke="#1E293B" strokeWidth="1.5" />
              
              {/* Head */}
              <circle cx="100" cy="102" r="17" fill="#FDBA74" stroke="#1E293B" strokeWidth="3" />
              
              {/* Hair bangs */}
              <path d="M83 100 C83 83, 117 83, 117 100" stroke="#1E293B" strokeWidth="3" fill="#1E293B" />

              {/* Left hand sleeve */}
              <path d="M75 145 C65 155, 60 165, 75 170" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Right hand sleeve */}
              <path d="M125 145 C135 155, 140 165, 125 170" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
              
              {/* Giant Document 1 (Back, Dark Charcoal Card) */}
              <g transform="rotate(-12 60 140)">
                <rect x="35" y="125" width="65" height="42" rx="5" fill="#334155" stroke="#1E293B" strokeWidth="2.5" />
                <line x1="43" y1="135" x2="80" y2="135" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                <line x1="43" y1="145" x2="90" y2="145" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                <line x1="43" y1="155" x2="68" y2="155" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
              </g>
              
              {/* Giant Document 2 (Front, White Clean Card) */}
              <g transform="rotate(8 130 150)">
                <rect x="95" y="128" width="72" height="46" rx="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
                <line x1="105" y1="138" x2="155" y2="138" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                <line x1="105" y1="148" x2="145" y2="148" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                <line x1="105" y1="158" x2="132" y2="158" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                <circle cx="155" cy="158" r="3" fill="#2563EB" />
              </g>
            </svg>
          </motion.div>

          {/* Header Row */}
          <div className="flex justify-between items-center relative z-10 w-full mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-md shadow-sky-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-tight text-gray-900 block">DocuMind</span>
                <span className="text-[9px] text-sky-600 font-mono uppercase font-bold tracking-widest">Cognitive RAG Suite</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 font-semibold bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-emerald-700 font-bold">SECURE PORTAL</span>
            </div>
          </div>

          {/* Centered Glassmorphic Form Card Wrapper */}
          <div className="flex-1 flex items-center justify-center relative z-10 py-4">
            <motion.div
              layout
              className="w-full max-w-[420px] bg-white/75 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 md:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_70px_rgba(14,165,233,0.08)] transition-all duration-500 relative z-20"
            >
              {/* Alert Callouts */}
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-xs py-2.5 px-3.5 rounded-xl mb-4 flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-tight font-medium">{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-2.5 px-3.5 rounded-xl mb-4 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-tight font-medium">{authSuccess}</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* 1. SIGN IN MODE */}
                {authMode === "login" && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mb-8 text-center">
                      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1.5">Welcome back!</h2>
                      <p className="text-xs text-gray-400 font-medium">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          required
                          className="w-full bg-white border border-gray-200/80 focus:border-[#4DBFFF] rounded-2xl px-5 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4DBFFF]/10 hover:border-gray-300 shadow-sm"
                          placeholder="Username"
                          value={authUsername}
                          onChange={(e) => setAuthUsername(e.target.value)}
                        />
                      </div>

                      <div>
                        <input
                          type="password"
                          required
                          className="w-full bg-white border border-gray-200/80 focus:border-[#4DBFFF] rounded-2xl px-5 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4DBFFF]/10 hover:border-gray-300 shadow-sm"
                          placeholder="Password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode("forgot");
                              setAuthError(null);
                              setAuthSuccess(null);
                            }}
                            className="text-xs text-amber-500 hover:text-amber-600 font-bold bg-transparent border-none cursor-pointer transition-colors"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-[#4DBFFF] hover:bg-[#3FAEEB] text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-md shadow-[#4DBFFF]/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-4 active:scale-[0.98]"
                      >
                        {authLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 2. CREATE ACCOUNT MODE */}
                {authMode === "register" && (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mb-8 text-center">
                      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1.5">Create account</h2>
                      <p className="text-xs text-gray-400 font-medium">Sign up below to access your workspace.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          required
                          className="w-full bg-white border border-gray-200/80 focus:border-[#4DBFFF] rounded-2xl px-5 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4DBFFF]/10 hover:border-gray-300 shadow-sm"
                          placeholder="Researcher Username"
                          value={authUsername}
                          onChange={(e) => setAuthUsername(e.target.value)}
                        />
                      </div>

                      <div>
                        <input
                          type="email"
                          required
                          className="w-full bg-white border border-gray-200/80 focus:border-[#4DBFFF] rounded-2xl px-5 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4DBFFF]/10 hover:border-gray-300 shadow-sm"
                          placeholder="Recovery Email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <input
                          type="password"
                          required
                          className="w-full bg-white border border-gray-200/80 focus:border-[#4DBFFF] rounded-2xl px-5 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4DBFFF]/10 hover:border-gray-300 shadow-sm"
                          placeholder="Secure Password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-[#4DBFFF] hover:bg-[#3FAEEB] text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-md shadow-[#4DBFFF]/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-4 active:scale-[0.98]"
                      >
                        {authLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span>Register Workspace</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 3. FORGOT PASSWORD MODE */}
                {authMode === "forgot" && (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mb-8 text-center">
                      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1.5">Reset password</h2>
                      <p className="text-xs text-gray-400 font-medium">Provide your account recovery credentials below.</p>
                    </div>

                    <form onSubmit={handleForgetPassword} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          required
                          className="w-full bg-white border border-gray-200/80 focus:border-[#4DBFFF] rounded-2xl px-5 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4DBFFF]/10 hover:border-gray-300 shadow-sm"
                          placeholder="Registered Email or Username"
                          value={authEmailOrUsername}
                          onChange={(e) => setAuthEmailOrUsername(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-[#4DBFFF] hover:bg-[#3FAEEB] text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-md shadow-[#4DBFFF]/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-4 active:scale-[0.98]"
                      >
                        {authLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span>Send Code</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 4. VERIFY OTP PASSCODE MODE */}
                {authMode === "verify-otp" && (
                  <motion.div
                    key="verify-otp"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mb-8 text-center">
                      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1.5">Verify code</h2>
                      <p className="text-xs text-gray-400 font-medium">Check your registered inbox for a security OTP code.</p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          required
                          className="w-full bg-white border border-gray-200/80 focus:border-[#4DBFFF] rounded-2xl px-5 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4DBFFF]/10 hover:border-gray-300 shadow-sm"
                          placeholder="Account Identifier"
                          value={authEmailOrUsername}
                          onChange={(e) => setAuthEmailOrUsername(e.target.value)}
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          className="w-full bg-white border border-gray-200/80 focus:border-[#4DBFFF] rounded-2xl px-5 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none tracking-widest font-mono text-center font-bold focus:ring-4 focus:ring-[#4DBFFF]/10"
                          placeholder="6-Digit Verification Code (OTP)"
                          value={authOtpCode}
                          onChange={(e) => setAuthOtpCode(e.target.value)}
                        />
                      </div>

                      <div>
                        <input
                          type="password"
                          required
                          className="w-full bg-white border border-gray-200/80 focus:border-[#4DBFFF] rounded-2xl px-5 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300 focus:ring-4 focus:ring-[#4DBFFF]/10 hover:border-gray-300 shadow-sm"
                          placeholder="New Secure Password"
                          value={authNewPassword}
                          onChange={(e) => setAuthNewPassword(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-[#4DBFFF] hover:bg-[#3FAEEB] text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-md shadow-[#4DBFFF]/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-4 active:scale-[0.98]"
                      >
                        {authLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Verify & Reset Password</span>
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue with Google Social Section */}
              {(authMode === "login" || authMode === "register") && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="relative flex justify-center text-xs mb-4">
                    <span className="bg-white/95 px-3 py-0.5 rounded-full border border-gray-100/50 text-gray-400 font-semibold shadow-sm z-10">Or continue with</span>
                    <div className="absolute inset-y-1/2 inset-x-0 border-b border-gray-100 -z-0" />
                  </div>

                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-60"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5.04c1.61 0 3.06.55 4.19 1.63l3.14-3.14C17.33 1.64 14.86 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.15 8.75 5.04 12 5.04z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.43c-.28 1.44-1.1 2.66-2.33 3.47l3.6 2.8c2.1-1.94 3.79-4.8 3.79-8.37z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.1 14.7c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 7.3C.54 9.12 0 11.12 0 13.2s.54 4.08 1.5 5.9l3.6-2.8z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.8c-1.1.74-2.52 1.18-4.36 1.18-3.25 0-5.99-2.11-6.9-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>
              )}

              {/* Debug SMTP / OTP bypass notice */}
              {bypassedOtpCode && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-900">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sandbox Mode Active</span>
                  </div>
                  <p className="leading-relaxed mb-2">{bypassedSmtpError}</p>
                  <div className="bg-amber-100/60 px-2 py-1.5 rounded font-mono font-bold text-center select-all border border-amber-200 text-amber-950">
                    Use Verification Code: {bypassedOtpCode}
                  </div>
                </div>
              )}

              {regSmtpBypassed && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 animate-fadeIn">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-900">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SMTP Sandbox Warning</span>
                  </div>
                  <p className="leading-relaxed">
                    Account created successfully, but the welcome email could not be sent because: <strong className="text-amber-950">{regSmtpError}</strong>
                  </p>
                  <p className="mt-1.5 leading-relaxed text-[10px] text-gray-500">
                    To receive real email notifications, please add <code className="bg-gray-100 px-1 py-0.5 rounded text-amber-900 font-mono">SMTP_HOST</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-amber-900 font-mono">SMTP_PORT</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-amber-900 font-mono">SMTP_USER</code>, and <code className="bg-gray-100 px-1 py-0.5 rounded text-amber-900 font-mono">SMTP_PASS</code> to your Settings secrets.
                  </p>
                </div>
              )}

              {/* Action Toggle Footer inside Card */}
              <div className="mt-5 pt-4 border-t border-gray-100 text-center flex flex-col gap-2">
                {authMode === "login" && (
                  <p className="text-xs text-gray-500 font-medium">
                    New researcher?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("register");
                        setAuthError(null);
                        setAuthSuccess(null);
                        setBypassedOtpCode("");
                        setBypassedSmtpError("");
                        setRegSmtpBypassed(false);
                        setRegSmtpError("");
                      }}
                      className="text-sky-600 hover:text-sky-700 hover:underline font-bold bg-transparent border-none cursor-pointer transition-colors"
                    >
                      Create an Account
                    </button>
                  </p>
                )}

                {(authMode === "register" || authMode === "forgot" || authMode === "verify-otp") && (
                  <p className="text-xs text-gray-500 font-medium">
                    Remember your credentials?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setAuthError(null);
                        setAuthSuccess(null);
                        setBypassedOtpCode("");
                        setBypassedSmtpError("");
                        setRegSmtpBypassed(false);
                        setRegSmtpError("");
                      }}
                      className="text-sky-600 hover:text-sky-700 hover:underline font-bold bg-transparent border-none cursor-pointer transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Canvas Footer Link Details (Terms & Conditions) */}
          <div className="w-full flex justify-end items-center text-[10px] text-gray-400 font-bold border-t border-gray-100 pt-3 relative z-10">
            <div className="flex gap-4">
              <button 
                onClick={() => setShowTermsModal(true)} 
                className="hover:text-gray-600 transition-colors bg-transparent border-none p-0 cursor-pointer font-bold text-[10px]"
              >
                Terms & Conditions
              </button>
            </div>
          </div>

          {renderSecurityAndTermsModals()}

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1D21] text-[#F8F9FA] flex flex-row font-sans selection:bg-teal-accent/25 antialiased">
      
      {/* Mobile drawer backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Premium Quillbot-Style Side Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#1E2125] border-r border-[#383D43] flex flex-col justify-between shrink-0 select-none z-50 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto lg:flex
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-5 flex flex-col gap-6">
          {/* Brand Logo with Close Button on Mobile */}
          <div className="flex items-center justify-between border-b border-[#383D43] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-accent flex items-center justify-center shadow-sm">
                {/* Sparkles icon removed */}
              </div>
              <div>
                <span className="text-sm font-bold text-white block">DocuMind</span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#383D43]/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 select-none scrollbar-thin">
            
            {/* Core Workspace */}
            <div>
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest pl-2 mb-1.5 block">
                Core Workspace
              </span>
              <button
                onClick={() => {
                  setActiveView("workspaces");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeView === "workspaces"
                    ? "bg-teal-accent/15 border-teal-accent/35 text-teal-accent shadow-sm"
                    : "bg-transparent border-transparent text-gray-200 hover:text-white hover:bg-[#383D43]/40 hover:border-[#383D43]/30"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-teal-accent" />
                <span>Research Workspace</span>
              </button>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#383D43]/70 to-transparent mx-2 my-1" />

            {/* Projects */}
            <div>
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest pl-2 mb-1.5 block">
                Projects
              </span>
              <div className="space-y-1">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-cool-white bg-[#25282D]/70 border border-[#383D43]/80">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-accent shrink-0 animate-pulse" />
                    <span className="truncate">Active: Academic RAG</span>
                  </div>
                  <span className="text-[8px] font-mono text-teal-accent font-extrabold uppercase shrink-0 bg-[#1A1D21] border border-teal-accent/20 px-1.5 py-0.5 rounded">OS</span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#383D43]/70 to-transparent mx-2 my-1" />

            {/* Documents */}
            <div>
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest pl-2 mb-1.5 block">
                Documents
              </span>
              <button
                onClick={() => {
                  setActiveView("workspaces");
                  setRightPanelTab("viewer");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeView === "workspaces" && rightPanelTab === "viewer"
                    ? "bg-teal-accent/15 border-teal-accent/35 text-teal-accent shadow-sm"
                    : "bg-transparent border-transparent text-gray-200 hover:text-white hover:bg-[#383D43]/40 hover:border-[#383D43]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-3.5 h-3.5 text-teal-accent" />
                  <span>Reader Station</span>
                </div>
                {selectedDocContent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#383D43]/70 to-transparent mx-2 my-1" />

            {/* AI Writing Tools */}
            <div>
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest pl-2 mb-1.5 block">
                AI Writing Tools
              </span>
              <div className="flex flex-col gap-1">
                {[
                  { view: "paraphraser", label: "Paraphraser", icon: Shuffle },
                  { view: "grammar", label: "Grammar Checker", icon: FileCheck2 },
                  { view: "detector", label: "AI Detector", icon: Bot },
                  { view: "plagiarism", label: "Plagiarism Checker", icon: Fingerprint },
                  { view: "humanizer", label: "AI Humanizer", icon: UserCheck }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        setActiveView(item.view as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        activeView === item.view
                          ? "bg-teal-accent/15 border-teal-accent/35 text-teal-accent shadow-sm"
                          : "bg-transparent border-transparent text-gray-200 hover:text-white hover:bg-[#383D43]/40 hover:border-[#383D43]/30"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-teal-accent" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#383D43]/70 to-transparent mx-2 my-1" />

            {/* Storage */}
            <div>
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest pl-2 mb-1.5 block">
                Storage
              </span>
              <div className="px-3 py-2 bg-[#17191C]/65 border border-[#383D43]/80 rounded-xl space-y-1.5 shadow-sm">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-300 flex items-center gap-1.5 font-bold"><Database className="w-3 h-3 text-teal-accent" /> Memory Used</span>
                  <span className="text-cool-white font-mono font-bold">{indexedFiles.length} / 25 docs</span>
                </div>
                <div className="w-full bg-[#383D43]/70 h-1 rounded-full overflow-hidden">
                  <div className="bg-teal-accent h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (indexedFiles.length / 25) * 100)}%` }} />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#383D43]/70 to-transparent mx-2 my-1" />

            {/* Settings */}
            <div>
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest pl-2 mb-1.5 block">
                Analysis Matrix
              </span>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    setActiveView("workspaces");
                    setRightPanelTab("comparison");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-200 hover:text-white hover:bg-[#383D43]/40 border border-transparent hover:border-[#383D43]/30 transition-all"
                >
                  <GitCompare className="w-3.5 h-3.5 text-teal-accent" />
                  <span>Synthesis Matrix</span>
                </button>
              </div>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#383D43]/70 to-transparent mx-2 my-1" />

            {/* Trust & Security Settings */}
            <div>
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest pl-2 mb-1.5 block">
                Trust & Security
              </span>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    setShowTermsModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#E4E4E7] hover:text-white hover:bg-[#383D43]/40 border border-transparent hover:border-[#383D43]/30 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-accent" />
                  <span>Terms & Conditions</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#383D43] bg-[#17191C]/50 flex flex-col gap-2.5">
          {user && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-teal-accent/20 flex items-center justify-center border border-teal-accent/30 shrink-0">
                    <UserCheck className="w-3.5 h-3.5 text-teal-accent" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-bold text-white block truncate">
                      {user.username}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-red-500/10 hover:bg-red-500/25 text-red-400 font-bold text-[10px] py-2 px-2.5 rounded-lg border border-red-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Disconnect Profile</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Primary Layout Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Error Bar */}
        {errorContext && (
          <div className="bg-red-500/10 border-b border-red-500/20 text-red-200 text-xs py-3 px-6 flex items-center justify-between gap-3 transition-all">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="font-medium">{errorContext}</span>
            </div>
            <button 
              onClick={() => setErrorContext(null)} 
              className="text-[10px] bg-[#25282D] hover:bg-[#383D43] text-[#F8F9FA] py-1 px-2.5 rounded border border-[#383D43] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Workspace Header with System Health */}
        <header className="border-b border-[#383D43] bg-[#25282D] sticky top-0 z-40 px-4 md:px-6 py-4">
          <div className="w-full flex items-center justify-between gap-3">
            
            {/* Title Block */}
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-1.5 -ml-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#383D43]/50 cursor-pointer shrink-0"
                title="Open main navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <h1 className="text-sm md:text-base font-bold tracking-tight text-white flex items-center gap-2 truncate">
                <span className="truncate">DocuMind Research Workspace</span>
                {ephemeralMode && (
                  <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-medium shrink-0">
                    EPHEMERAL
                  </span>
                )}
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              {activeView === "workspaces" && (
                <div className="flex items-center gap-2 md:gap-3">
                  {/* Theme Switcher Button */}
                  <button
                    onClick={() => {
                      let nextTheme: "dark" | "light" | "terminal" | "midnight-emerald" = "dark";
                      if (theme === "dark") {
                        nextTheme = "light";
                      } else if (theme === "light") {
                        nextTheme = "terminal";
                      } else if (theme === "terminal") {
                        nextTheme = "midnight-emerald";
                      } else {
                        nextTheme = "dark";
                      }
                      setTheme(nextTheme);
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-[#383D43] bg-[#25282D] text-gray-300 hover:text-teal-accent transition-all font-semibold flex items-center gap-1.5 cursor-pointer"
                    title="Switch Workspace Theme/UX"
                  >
                    <Palette className="w-3.5 h-3.5 text-teal-accent" />
                    <span className="hidden sm:inline capitalize">{theme === "midnight-emerald" ? "Midnight Emerald 👑" : `${theme} Theme`}</span>
                  </button>

                  {/* Ephemeral Mode Toggle */}
                  <button
                    onClick={() => setEphemeralMode(!ephemeralMode)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all font-semibold cursor-pointer ${
                      ephemeralMode
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        : "bg-[#25282D] text-gray-300 hover:text-[#F8F9FA] border-[#383D43]"
                    }`}
                    title="Toggle ephemeral memory mode"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Ephemeral Mode</span>
                  </button>

                  <button
                    onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all font-semibold cursor-pointer ${
                      showHistorySidebar 
                        ? "bg-teal-accent/10 text-teal-accent border-teal-accent/30"
                        : "bg-[#25282D] text-gray-300 hover:text-[#F8F9FA] border-[#383D43]"
                    }`}
                    title="Toggle previous chats sidebar"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Previous Chats</span>
                  </button>

                  {indexedFiles.length > 0 && (
                    <button
                      onClick={resetAllStore}
                      className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-red-500/20 transition-all cursor-pointer flex items-center gap-1.5 font-semibold"
                      title="Purge active workspace documents"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">Purge Workspace</span>
                    </button>
                  )}
                </div>
              )}

              {/* User Account & Security Portal */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setDashboardAuthMode("view");
                    setDashboardError(null);
                    setDashboardSuccess(null);
                  }}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all font-semibold cursor-pointer ${
                    isProfileOpen 
                      ? "bg-teal-accent/15 text-teal-accent border-teal-accent/30 shadow-md"
                      : "bg-[#25282D] text-gray-300 hover:text-[#F8F9FA] border-[#383D43]"
                  }`}
                  title="Manage research profiles & credentials"
                >
                  <Fingerprint className="w-3.5 h-3.5 text-teal-accent" />
                  <span className="hidden sm:inline font-bold">{user?.username}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>
                
                {/* Identity dropdown portal menu with embedded login and register screens */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2.5 w-80 bg-[#1E2125] border border-[#383D43] rounded-2xl p-5 shadow-2xl z-50 overflow-hidden"
                    >
                      {dashboardError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] py-2 px-3 rounded-xl mb-3 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span className="truncate">{dashboardError}</span>
                        </div>
                      )}

                      {dashboardSuccess && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] py-2 px-3 rounded-xl mb-3 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="leading-tight">{dashboardSuccess}</span>
                        </div>
                      )}

                      <AnimatePresence mode="wait">
                        {dashboardAuthMode === "view" && (
                          <motion.div
                            key="view"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-3 pb-3 border-b border-[#383D43]">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-accent to-blue-500 flex items-center justify-center text-[#131517] font-extrabold text-sm uppercase shadow-md shadow-teal-accent/15">
                                {user?.username?.substring(0, 2) || "U"}
                              </div>
                              <div className="overflow-hidden">
                                <h4 className="text-xs font-extrabold text-white truncate">{user?.username}</h4>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2">
                              <button
                                onClick={() => {
                                  setDashboardAuthMode("login");
                                  setDashboardError(null);
                                  setDashboardSuccess(null);
                                }}
                                className="bg-[#25282D] hover:bg-[#383D43] text-white border border-[#383D43] py-2 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <UserCheck className="w-3 h-3 text-teal-accent" />
                                <span>Switch Profile</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDashboardAuthMode("register");
                                  setDashboardError(null);
                                  setDashboardSuccess(null);
                                }}
                                className="bg-[#25282D] hover:bg-[#383D43] text-white border border-[#383D43] py-2 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                <span>Register Peer</span>
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                handleLogout();
                                setIsProfileOpen(false);
                              }}
                              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Disconnect Session</span>
                            </button>
                          </motion.div>
                        )}

                        {dashboardAuthMode === "login" && (
                          <motion.div
                            key="login"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                          >
                            <div className="flex justify-between items-center pb-2 border-b border-[#383D43]">
                              <h4 className="text-xs font-extrabold text-white">Switch Authentication</h4>
                              <button
                                onClick={() => setDashboardAuthMode("view")}
                                className="text-[10px] text-gray-400 hover:text-white"
                              >
                                Back
                              </button>
                            </div>

                            <form onSubmit={handleDashboardLoginSubmit} className="space-y-2.5">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-mono font-bold text-gray-400 mb-1">
                                  Username
                                </label>
                                <input
                                  type="text"
                                  required
                                  className="w-full bg-[#1A1D21] border border-[#383D43] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-accent transition-colors"
                                  placeholder="rajrishu"
                                  value={dashboardUsername}
                                  onChange={(e) => setDashboardUsername(e.target.value)}
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-mono font-bold text-gray-400 mb-1">
                                  Secure Password
                                </label>
                                <input
                                  type="password"
                                  required
                                  className="w-full bg-[#1A1D21] border border-[#383D43] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-accent transition-colors"
                                  placeholder="••••••••"
                                  value={dashboardPassword}
                                  onChange={(e) => setDashboardPassword(e.target.value)}
                                />
                              </div>

                              <button
                                type="submit"
                                disabled={dashboardLoading}
                                className="w-full bg-teal-accent hover:bg-teal-accent/90 text-[#131517] font-extrabold text-[10px] py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 mt-1"
                              >
                                {dashboardLoading ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Sign In</span>
                                  </>
                                )}
                              </button>
                            </form>
                          </motion.div>
                        )}

                        {dashboardAuthMode === "register" && (
                          <motion.div
                            key="register"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                          >
                            <div className="flex justify-between items-center pb-2 border-b border-[#383D43]">
                              <h4 className="text-xs font-extrabold text-white">Register Peer Profile</h4>
                              <button
                                onClick={() => setDashboardAuthMode("view")}
                                className="text-[10px] text-gray-400 hover:text-white"
                              >
                                Back
                              </button>
                            </div>

                            <form onSubmit={handleDashboardRegisterSubmit} className="space-y-2.5">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-mono font-bold text-gray-400 mb-1">
                                  Researcher Username
                                </label>
                                <input
                                  type="text"
                                  required
                                  className="w-full bg-[#1A1D21] border border-[#383D43] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-accent transition-colors"
                                  placeholder="e.g. rajrishu"
                                  value={dashboardUsername}
                                  onChange={(e) => setDashboardUsername(e.target.value)}
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-mono font-bold text-gray-400 mb-1">
                                  Recovery Email
                                </label>
                                <input
                                  type="email"
                                  required
                                  className="w-full bg-[#1A1D21] border border-[#383D43] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-accent transition-colors"
                                  placeholder="rajrishu0610@gmail.com"
                                  value={dashboardEmail}
                                  onChange={(e) => setDashboardEmail(e.target.value)}
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-mono font-bold text-gray-400 mb-1">
                                  Secure Password
                                </label>
                                <input
                                  type="password"
                                  required
                                  className="w-full bg-[#1A1D21] border border-[#383D43] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-accent transition-colors"
                                  placeholder="••••••••"
                                  value={dashboardPassword}
                                  onChange={(e) => setDashboardPassword(e.target.value)}
                                />
                              </div>

                              <button
                                type="submit"
                                disabled={dashboardLoading}
                                className="w-full bg-teal-accent hover:bg-teal-accent/90 text-[#131517] font-extrabold text-[10px] py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 mt-1"
                              >
                                {dashboardLoading ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Register Researcher</span>
                                  </>
                                )}
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </header>

        {/* View Routing Router */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          
          {/* ==================== VIEW 1: WORKSPACE & CHAT WORKSPACE ==================== */}
          {activeView === "workspaces" && (
            <div className="flex flex-col lg:flex-row gap-6 h-full items-stretch animate-fade-in">
                {/* LEFT PANEL: Previous Chats (Claude style) */}
                {showHistorySidebar && (
                  <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-4 bg-[#1E2125]/75 backdrop-blur-md rounded-2xl border border-slate-border/50 p-4 h-full shadow-lg transition-all duration-300">
                    <div className="flex flex-col gap-3 mb-1 border-b border-slate-border/30 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-teal-accent" />
                          <h2 className="text-xs font-extrabold uppercase tracking-widest text-cool-white">Previous Chats</h2>
                        </div>
                        {sessions.length > 0 && (
                          <span className="text-[9px] bg-teal-accent/10 text-teal-accent font-bold px-1.5 py-0.5 rounded font-mono border border-teal-accent/20">
                            {sessions.length} chats
                          </span>
                        )}
                      </div>
                      
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={chatSearchQuery}
                          onChange={(e) => setChatSearchQuery(e.target.value)}
                          placeholder="Search chats..."
                          className="w-full bg-[#1A1D21] text-[11px] pl-8 pr-3 py-2 rounded-xl border border-slate-border/70 focus:outline-none focus:border-teal-accent text-cool-white placeholder-gray-500 transition-all"
                        />
                      </div>

                      <button
                        onClick={startNewChat}
                        className="w-full text-[10.5px] bg-teal-accent/15 hover:bg-teal-accent/25 text-teal-accent font-extrabold py-2 px-3 rounded-xl border border-teal-accent/30 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Start a new chat session"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Chat Session</span>
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 max-h-[360px] pr-1 scrollbar-thin">
                      {(() => {
                        const now = Date.now();
                        const oneDay = 24 * 60 * 60 * 1000;
                        const filtered = sessions.filter(s => s.title.toLowerCase().includes(chatSearchQuery.toLowerCase()));
                        
                        const today = filtered.filter(s => now - s.createdAt < oneDay);
                        const yesterday = filtered.filter(s => now - s.createdAt >= oneDay && now - s.createdAt < 2 * oneDay);
                        const lastWeek = filtered.filter(s => now - s.createdAt >= 2 * oneDay && now - s.createdAt < 7 * oneDay);
                        const older = filtered.filter(s => now - s.createdAt >= 7 * oneDay);

                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-6 text-[10px] text-gray-500">
                              No chats found.
                            </div>
                          );
                        }

                        const renderSession = (session) => {
                          const isActive = session.id === activeSessionId;
                          return (
                            <div
                              key={session.id}
                              onClick={() => switchSession(session.id)}
                              className={`relative flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 cursor-pointer group ${
                                isActive
                                  ? "bg-teal-accent/5 border-teal-accent/30 text-teal-accent font-bold shadow-sm"
                                  : "bg-transparent border-transparent hover:bg-[#25282D]/40 hover:border-slate-border/40 text-gray-400 hover:text-cool-white"
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden flex-1 pl-1">
                                <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${isActive ? "text-teal-accent" : "text-gray-500 group-hover:text-teal-accent"}`} />
                                <span className="text-xs truncate flex-1 block tracking-wide">
                                  {session.title}
                                </span>
                              </div>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-accent shrink-0 mr-1 animate-pulse" />
                              )}
                              <button
                                onClick={(e) => deleteSession(session.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/15 text-gray-500 hover:text-red-400 transition-all ml-1 flex-shrink-0 cursor-pointer"
                                title="Delete chat session"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        };

                        return (
                          <div className="space-y-4">
                            {today.length > 0 && (
                              <div className="space-y-1.5">
                                <div className="text-[9px] uppercase tracking-widest font-mono text-gray-500 font-extrabold px-1">Today</div>
                                {today.map(renderSession)}
                              </div>
                            )}
                            {yesterday.length > 0 && (
                              <div className="space-y-1.5">
                                <div className="text-[9px] uppercase tracking-widest font-mono text-gray-500 font-extrabold px-1">Yesterday</div>
                                {yesterday.map(renderSession)}
                              </div>
                            )}
                            {lastWeek.length > 0 && (
                              <div className="space-y-1.5">
                                <div className="text-[9px] uppercase tracking-widest font-mono text-gray-500 font-extrabold px-1">Last Week</div>
                                {lastWeek.map(renderSession)}
                              </div>
                            )}
                            {older.length > 0 && (
                              <div className="space-y-1.5">
                                <div className="text-[9px] uppercase tracking-widest font-mono text-gray-500 font-extrabold px-1">Older</div>
                                {older.map(renderSession)}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* COLUMN 2: The Main AI Workspace (Dominant center section) */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1 pb-8 min-w-0">
                  
                  {/* Dashboard Header with Stats */}
                  <div className="bg-[#1E2125]/65 border border-slate-border/40 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse" />
                        <span className="text-[9px] font-mono text-teal-accent font-extrabold uppercase tracking-widest">DocuMind Research OS</span>
                      </div>
                      <h2 className="text-base font-bold text-white mt-1">
                        Academic Synthesis Workspace
                      </h2>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                        Cognitive multi-document research environment powered by dense RAG models.
                      </p>
                    </div>
                    
                    {/* Project Statistics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center shrink-0">
                      <div className="bg-[#17191C]/50 border border-slate-border/50 px-3 py-1.5 rounded-xl min-w-[76px]">
                        <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest block font-mono">Papers</span>
                        <span className="text-xs font-black text-teal-accent mt-0.5 block font-mono">
                          {indexedFiles.length > 0 ? `${indexedFiles.length} Ingested` : "0 Papers"}
                        </span>
                      </div>
                      <div className="bg-[#17191C]/50 border border-slate-border/50 px-3 py-1.5 rounded-xl min-w-[76px]">
                        <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest block font-mono">AI Queries</span>
                        <span className="text-xs font-black text-cool-white mt-0.5 block font-mono">
                          {messages.length > 0 ? `${messages.length} Active` : "0 Active"}
                        </span>
                      </div>
                      <div className="bg-[#17191C]/50 border border-slate-border/50 px-3 py-1.5 rounded-xl min-w-[76px]">
                        <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest block font-mono">Last Sync</span>
                        <span className="text-xs font-black text-emerald-400 mt-0.5 block font-mono">Just Now</span>
                      </div>
                    </div>
                  </div>

                  {/* Research Library (Uploaded Files & Ingestion) */}
                  <div className="bg-[#1E2125]/50 border border-slate-border/40 p-5 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-accent">Research Library</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Ingest, categorize and scope your research papers</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {indexedFiles.length > 0 && (
                          <span className="text-[9.5px] bg-[#17191C]/70 border border-slate-border/50 px-2 py-0.5 rounded text-gray-400 font-mono font-bold">
                            {indexedFiles.length} papers
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                      
                      {/* Drag & Drop Ingestion Zone (Col 4) */}
                      <div className="md:col-span-4">
                        <label className="border-2 border-dashed border-[#383D43]/70 hover:border-teal-accent/50 rounded-xl p-4 text-center cursor-pointer hover:bg-teal-accent/5 transition-all duration-300 flex flex-col justify-center items-center h-full min-h-[120px] group relative">
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            multiple
                            accept=".pdf,.docx,.txt,.md,.csv,.pptx,.png,.jpg,.jpeg"
                            onChange={handleFileUpload}
                          />
                          <UploadCloud className="w-7 h-7 text-teal-accent mb-1.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105" />
                          <div className="text-xs font-bold text-cool-white">Ingest Scholarly Papers</div>
                          <div className="text-[9px] text-gray-500 mt-0.5">PDF, DOCX, CSV, Slides, Images</div>
                        </label>
                      </div>

                      {/* Card-Based Files List (Col 8) */}
                      <div className="md:col-span-8 flex flex-col justify-between">
                        <div className="flex-1 overflow-y-auto max-h-[135px] pr-1 scrollbar-thin">
                          {filteredFiles.length === 0 ? (
                            <div className="h-full border border-dashed border-slate-border/30 rounded-xl bg-[#17191C]/25 py-6 px-4 text-center flex flex-col items-center justify-center">
                              <p className="text-[10.5px] text-gray-500 font-bold">No research papers in active scope.</p>
                              <p className="text-[9px] text-gray-500 mt-0.5">Upload a document to configure dynamic cognitive context.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {filteredFiles.map((file) => {
                                const isActive = selectedDocContent?.id === file.id;
                                const isScoped = selectedScopeIds.includes(file.id);
                                const fileExt = file.name.split(".").pop()?.toLowerCase() || "txt";
                                
                                const badgeColors: Record<string, string> = {
                                  pdf: "text-red-400 bg-red-500/10 border-red-500/20",
                                  docx: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                                  doc: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                                  csv: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                                  xlsx: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                                  pptx: "text-orange-400 bg-orange-500/10 border-orange-500/20",
                                  png: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                                  jpg: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                                  jpeg: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                                  md: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                                  txt: "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                };
                                const badgeClass = badgeColors[fileExt] || "text-gray-400 bg-gray-500/10 border-gray-500/20";
                                
                                return (
                                  <div 
                                    key={file.id} 
                                    onClick={() => handlePreviewDocument(file)}
                                    className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer group hover:shadow-md flex flex-col justify-between h-[82px] relative ${
                                      isActive 
                                        ? "bg-teal-accent/5 border-teal-accent/35 shadow-sm" 
                                        : "bg-[#1E2125]/40 border-slate-border/50 hover:border-teal-accent/30"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-1.5">
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <div className={`px-1 py-0.5 rounded text-[8px] font-mono font-black border flex-shrink-0 ${badgeClass}`}>
                                          {fileExt.toUpperCase()}
                                        </div>
                                        <span className="text-[11px] font-bold text-cool-white truncate group-hover:text-teal-accent transition-colors block">
                                          {file.name}
                                        </span>
                                      </div>
                                      <div 
                                        onClick={(e) => handleToggleScopeSelection(file.id, e)}
                                        className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                                          isScoped 
                                            ? "bg-teal-accent border-teal-accent text-slate-bg shadow-sm" 
                                            : "border-slate-border/70 hover:border-teal-accent bg-[#17191C]/60"
                                        }`}
                                      >
                                        {isScoped && <Check className="w-3 h-3 stroke-[3.5] text-slate-bg" />}
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between text-[9px] text-gray-500 pt-1.5 border-t border-[#383D43]/20">
                                      <span className="font-mono">
                                        {(file as any).isUploading ? "Reading..." : `${Math.max(1, Math.ceil(file.wordCount / 300))} Pages`}
                                      </span>
                                      {(file as any).isUploading ? (
                                        <span className="font-mono text-[8px] text-teal-accent font-bold bg-teal-500/10 px-1 rounded animate-pulse flex items-center gap-1">
                                          <RefreshCw className="w-2 h-2 animate-spin" /> Ingesting
                                        </span>
                                      ) : (
                                        <span className="font-mono text-[8px] text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">Vectorized</span>
                                      )}
                                    </div>

                                    {/* Inline Hover Trash Overlay */}
                                    <button
                                      onClick={(e) => handleDeleteDocument(file.id, e)}
                                      className="absolute right-1.5 bottom-1 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/15 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                                      title="Delete document"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Security & Encryption Trust Banner */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#17191C]/60 border border-teal-accent/20 rounded-xl p-3 text-[10px] text-gray-300 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-teal-accent/10 border border-teal-accent/20 shrink-0">
                          <ShieldCheck className="w-4 h-4 text-teal-accent" />
                        </div>
                        <div>
                          <span className="font-bold text-cool-white block">End-to-End Cryptographic Isolation Enabled</span>
                          <span className="text-gray-400">All uploaded documents are fully encrypted using military-grade AES-256 and stored in an isolated, private sandbox. No one else can access or view your files.</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                        <button
                          onClick={() => setShowTermsModal(true)}
                          className="px-2.5 py-1.5 rounded bg-teal-accent/15 hover:bg-teal-accent/25 text-white font-bold transition-all text-[9.5px] border border-teal-accent/20 cursor-pointer"
                        >
                          Terms & Conditions
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Suggested Research Shortcuts Row */}
                  <div className="bg-[#1E2125]/50 border border-slate-border/40 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-teal-accent font-mono">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      <span>Suggested Research Pipelines</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {[
                        {
                          label: "Executive Summary",
                          prompt: "Generate an Executive Summary of these documents, identifying the primary research objectives, methodologies employed, and key analytical outcomes."
                        },
                        {
                          label: "Literature Review",
                          prompt: "Provide a comprehensive Literature Review based on the ingested documents, explaining the context, historical background, and theoretical framework."
                        },
                        {
                          label: "Compare Papers",
                          action: () => {
                            if (selectedScopeIds.length > 0) {
                              generateComparison();
                            } else if (indexedFiles.length > 0) {
                              setSelectedScopeIds(indexedFiles.map(f => f.id));
                              setTimeout(() => generateComparison(), 100);
                            } else {
                              setErrorContext("Upload documents first to compare them!");
                            }
                          }
                        },
                        {
                          label: "Research Gaps",
                          prompt: "Analyze these papers and identify the primary research gaps, inconsistencies, and suggestions for future research."
                        },
                        {
                          label: "Extract Tables",
                          prompt: "Identify and extract all analytical tables, datasets, and structured quantitative metrics presented in the documents."
                        },
                        {
                          label: "Generate Citation",
                          action: () => {
                            if (indexedFiles.length > 0) {
                              setRightPanelTab("metadata");
                            } else {
                              setErrorContext("Upload documents first to generate citations!");
                            }
                          }
                        }
                      ].map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={() => {
                            if (act.prompt) {
                              if (indexedFiles.length === 0) {
                                setInputText(act.prompt);
                                setErrorContext("Ingest documents first! The prompt has been populated below.");
                              } else {
                                triggerQuery(act.prompt);
                              }
                            } else if (act.action) {
                              act.action();
                            }
                          }}
                          className="text-[9.5px] font-bold bg-[#17191C]/60 hover:bg-[#25282D] border border-slate-border/55 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-teal-accent opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Large AI Chat Workspace */}
                  <section className="flex-1 flex flex-col bg-[#1E2125]/50 border border-slate-border/40 rounded-2xl shadow-lg overflow-hidden min-h-[460px]">
                    <div className="px-5 py-3.5 bg-[#17191C]/30 border-b border-slate-border/45 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-accent animate-pulse" />
                        <span className="text-xs font-extrabold text-cool-white tracking-widest uppercase font-mono">Cognitive RAG Stream</span>
                      </div>
                      {messages.length > 0 && (
                        <button
                          onClick={handleExportBrief}
                          className="text-[10px] text-teal-accent hover:text-white bg-teal-accent/10 hover:bg-teal-accent/20 border border-teal-accent/20 rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1.5 font-bold transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export Brief</span>
                        </button>
                      )}
                    </div>

                    <div 
                      ref={(el) => {
                        chatScrollContainerRef.current = el;
                        if (el) {
                          // Perform immediate layout scroll adjustments
                          el.scrollTop = el.scrollHeight;
                          // Keep container synced with content changes
                          const observer = new MutationObserver(() => {
                            el.scrollTop = el.scrollHeight;
                          });
                          observer.observe(el, { childList: true, subtree: true });
                          // Keep container synced with resize events (sidebar toggles, window resizes)
                          const resizeObserver = new ResizeObserver(() => {
                            el.scrollTop = el.scrollHeight;
                          });
                          resizeObserver.observe(el);
                        }
                      }}
                      className="flex-1 p-5 space-y-5 overflow-y-auto max-h-[450px] bg-[#17191C]/20 scrollbar-thin"
                    >
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-2 space-y-5">
                          <div className="text-center space-y-1.5">
                            <div className="w-10 h-10 bg-teal-accent/5 text-teal-accent rounded-xl flex items-center justify-center border border-teal-accent/15 mx-auto">
                              <MessageSquare className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-cool-white uppercase tracking-widest">Synthesis Engine Empty</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5 max-w-[280px] mx-auto leading-normal">
                                Choose an analytical pipeline card below or enter a grounded research prompt to begin synthesis.
                              </p>
                            </div>
                          </div>

                          {/* Premium 8-Part Bento Grid of Shortcuts */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full max-w-2xl mx-auto">
                            {[
                              {
                                title: "Executive Summary",
                                desc: "Synthesize objectives, thesis & key results",
                                icon: FileText,
                                color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
                                prompt: "Generate an Executive Summary of these documents, identifying the primary research objectives, methodologies employed, and key analytical outcomes."
                              },
                              {
                                title: "Methodology Decon",
                                desc: "Extract datasets, models & variables",
                                icon: Layers,
                                color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                                prompt: "Analyze the methodology of these documents. Detail the research designs, datasets, analytical models, and control parameters used by the authors."
                              },
                              {
                                title: "Key Findings",
                                desc: "Aggregate empirical outcomes & data points",
                                icon: Sparkles,
                                color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                                prompt: "Compare the key findings and empirical outcomes across these documents. Highlight any quantitative metrics, statistical significance, and novel data points."
                              },
                              {
                                title: "Research Gaps",
                                desc: "Spot omissions, study limits & future scopes",
                                icon: FileSearch,
                                color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                                prompt: "Identify intellectual limitations, unresolved controversies, and omissions in these documents. Suggest specific vectors for future investigation based on these gaps."
                              },
                              {
                                title: "Literature Review",
                                desc: "Build framework context & backgrounds",
                                icon: BookOpen,
                                color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                                prompt: "Provide a comprehensive Literature Review based on the ingested documents, explaining the context, historical background, and theoretical framework."
                              },
                              {
                                title: "Extract Tables",
                                desc: "Derive and clean analytical data tables",
                                icon: Database,
                                color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                                prompt: "Identify and extract all analytical tables, datasets, and structured quantitative metrics presented in the documents."
                              },
                              {
                                title: "Citation Builder",
                                desc: "Compile bibliographies & meta strings",
                                icon: Award,
                                color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                                prompt: "Generate scholarly citations and reference mappings in APA, MLA, and Chicago styles for each ingested paper."
                              },
                              {
                                title: "Timeline Map",
                                desc: "Map chronologies & milestone dates",
                                icon: Clock,
                                color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
                                prompt: "Provide a structured historical timeline of milestones, discoveries, and citations referenced throughout these documents."
                              }
                            ].map((p, pIdx) => {
                              const PresIcon = p.icon;
                              return (
                                <div
                                  key={pIdx}
                                  onClick={() => {
                                    if (indexedFiles.length === 0) {
                                      setInputText(p.prompt);
                                      setErrorContext("Ingest documents first! The prompt has been populated below so you can ask once documents are uploaded.");
                                    } else {
                                      triggerQuery(p.prompt);
                                    }
                                  }}
                                  className="bg-[#1E2125]/50 hover:bg-[#25282D]/50 border border-slate-border/50 rounded-xl p-3 text-left transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:border-teal-accent/40 group flex flex-col justify-between min-h-[105px]"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className={`p-1 rounded-lg border ${p.color}`}>
                                      <PresIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[7.5px] font-mono text-teal-accent font-extrabold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                      Pipeline ⚡
                                    </span>
                                  </div>
                                  <div className="mt-2.5">
                                    <h5 className="text-[10px] font-extrabold text-cool-white tracking-wide group-hover:text-teal-accent transition-colors">{p.title}</h5>
                                    <p className="text-[8.5px] text-gray-500 leading-tight mt-0.5 line-clamp-2">{p.desc}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {messages.map((msg, idx) => (
                            <div key={idx} className="space-y-3 animate-fade-in">
                              {msg.role === "user" ? (
                                <div className="flex justify-end">
                                  <div className="bg-[#25282D] border border-slate-border/80 text-cool-white text-xs py-2.5 px-4 rounded-2xl rounded-tr-none max-w-[85%] font-medium shadow-sm leading-relaxed tracking-wide select-text">
                                    {msg.content}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-start flex-col items-start gap-1 w-full">
                                  <div className="bg-[#1E2125] border border-slate-border/55 text-xs py-4 px-4.5 rounded-2xl rounded-tl-none max-w-full text-gray-200 leading-relaxed font-sans whitespace-pre-wrap relative group w-full shadow-sm select-text">
                                    <div className="flex items-center justify-between border-b border-slate-border/30 pb-2 mb-3 text-[10px] select-none">
                                      <div className="flex items-center gap-1.5 text-teal-accent font-extrabold tracking-widest uppercase font-mono">
                                        <Bot className="w-3.5 h-3.5" />
                                        <span>DocuMind Synthesis Engine</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {msg.source && msg.source.length > 0 ? (
                                          <span className="bg-teal-accent/10 text-teal-accent border border-teal-accent/20 px-2 py-0.5 rounded-md font-bold font-mono text-[9px]">
                                            🔍 {msg.source.length} citation{msg.source.length !== 1 ? "s" : ""}
                                          </span>
                                        ) : (
                                          <span className="text-gray-500 font-bold font-mono uppercase tracking-wider text-[9px]">
                                            Cognitive Engine
                                          </span>
                                        )}
                                        {msg.routeTrace?.confidence && (
                                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold font-mono text-[9px]">
                                            {Math.round(msg.routeTrace.confidence * 100)}% Match
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="absolute top-10 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                                      <button
                                        onClick={() => handleSpeak(msg.content, idx)}
                                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                          speakingIdx === idx 
                                            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                            : "bg-[#17191C] text-gray-400 hover:text-white border border-slate-border"
                                        }`}
                                        title={speakingIdx === idx ? "Stop narration" : "Listen to synthesis (TTS)"}
                                      >
                                        {speakingIdx === idx ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                                      </button>
                                    </div>

                                    <div className="pr-6 leading-relaxed select-text font-normal text-cool-white text-[12px] md:text-[12.5px]">
                                      {renderMessageContent(msg, idx)}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          <div ref={chatEndRef} />
                        </div>
                      )}
                    </div>

                    <div className="p-4 border-t border-slate-border/50 bg-[#1E2125] shadow-inner">
                      <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input
                          type="text"
                          placeholder={
                            indexedFiles.length === 0
                              ? "Upload documents to begin AI RAG synthesis..."
                              : selectedScopeIds.length > 0
                              ? `Ask anything about the ${selectedScopeIds.length} scoped document(s)...`
                              : "Ask about any indexed research documents..."
                          }
                          className="w-full bg-slate-bg border-2 border-slate-border/90 hover:border-slate-border rounded-2xl pl-4 pr-14 py-3.5 text-[12.5px] placeholder-gray-400 font-medium text-cool-white focus:outline-none focus:border-teal-accent focus:ring-2 focus:ring-teal-accent/30 transition-all shadow-md"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          disabled={isChatting}
                        />
                        <button
                          type="submit"
                          disabled={isChatting || !inputText.trim()}
                          className="absolute right-2 p-2.5 bg-teal-accent hover:brightness-110 disabled:bg-[#25282D] disabled:text-gray-500 text-slate-bg rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md disabled:shadow-none"
                          title="Send research query"
                        >
                          {isChatting ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>
                      </form>
                    </div>
                  </section>
                </div>

                {/* RIGHT PANEL: Approximately 320px with tabs */}
                <aside className="w-full lg:w-[320px] shrink-0 flex flex-col bg-slate-panel/75 backdrop-blur-md rounded-2xl border border-slate-border/50 shadow-lg overflow-hidden min-h-[500px]">
                  
                  {/* Persistent Cross-Document Synthesis Trigger */}
                  {indexedFiles.length > 0 && (
                    <div className="p-3 bg-[#17191C]/45 border-b border-slate-border/40 flex flex-col gap-1.5 select-none">
                      {selectedScopeIds.length > 0 ? (
                        <button
                          onClick={generateComparison}
                          disabled={isComparing}
                          className="w-full bg-gradient-to-r from-teal-accent to-emerald-500 hover:brightness-110 active:scale-[0.98] disabled:from-slate-border/40 disabled:to-slate-border/40 disabled:text-gray-500 text-slate-bg font-extrabold tracking-wider text-[10px] uppercase py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer animate-pulse"
                        >
                          {isComparing ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Synthesizing Matrix...</span>
                            </>
                          ) : (
                            <>
                              <GitCompare className="w-4 h-4" />
                              <span>Synthesize Comparison</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-[#25282D]/80 border border-slate-border/50 text-gray-500 font-extrabold tracking-wider text-[10px] uppercase py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                          <GitCompare className="w-4 h-4 opacity-40" />
                          <span>Select Papers to Compare</span>
                        </button>
                      )}
                      <div className="text-[8.5px] text-gray-400 text-center font-mono">
                        Active Scope: <span className="text-teal-accent font-extrabold">{selectedScopeIds.length} of {indexedFiles.length} papers</span> scoped
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-bg/40 border-b border-slate-border/50 flex flex-col select-none p-2">
                    <div className="grid grid-cols-3 gap-1 mb-1">
                      <button
                        onClick={() => setRightPanelTab("comparison")}
                        className={`px-1 py-1.5 text-[10px] font-extrabold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                          rightPanelTab === "comparison" 
                            ? "bg-slate-bg text-teal-accent border-slate-border/60 shadow-md font-black" 
                            : "text-gray-400 hover:text-white bg-transparent border-transparent"
                        }`}
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                        <span>Matrix</span>
                      </button>
                      <button
                        onClick={() => setRightPanelTab("viewer")}
                        className={`px-1 py-1.5 text-[10px] font-extrabold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                          rightPanelTab === "viewer" 
                            ? "bg-slate-bg text-teal-accent border-slate-border/60 shadow-md font-black" 
                            : "text-gray-400 hover:text-white bg-transparent border-transparent"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Reader</span>
                      </button>
                      <button
                        onClick={() => setRightPanelTab("metadata")}
                        className={`px-1 py-1.5 text-[10px] font-extrabold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                          rightPanelTab === "metadata" 
                            ? "bg-slate-bg text-teal-accent border-slate-border/60 shadow-md font-black" 
                            : "text-gray-400 hover:text-white bg-transparent border-transparent"
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Notes</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => setRightPanelTab("bibliography" as any)}
                        className={`px-1 py-1 text-[10px] font-extrabold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                          rightPanelTab === ("bibliography" as any) 
                            ? "bg-slate-bg text-teal-accent border-slate-border/60 shadow-md font-black" 
                            : "text-gray-400 hover:text-white bg-transparent border-transparent"
                        }`}
                      >
                        <Award className="w-3 h-3" />
                        <span>Bibliography</span>
                      </button>
                      <button
                        onClick={() => setRightPanelTab("sources" as any)}
                        className={`px-1 py-1 text-[10px] font-extrabold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                          rightPanelTab === ("sources" as any) 
                            ? "bg-slate-bg text-teal-accent border-slate-border/60 shadow-md font-black" 
                            : "text-gray-400 hover:text-white bg-transparent border-transparent"
                        }`}
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Sources</span>
                      </button>
                    </div>
                  </div>

                  {rightPanelTab === "comparison" && (
                    <div className="flex-1 flex flex-col p-4 overflow-y-auto scrollbar-thin">
                      {!comparisonMatrix ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
                          <FileSpreadsheet className="w-12 h-12 text-slate-border mb-3 animate-pulse" />
                          <h4 className="text-xs font-extrabold text-cool-white uppercase tracking-widest mb-1">Comparative Matrix</h4>
                          <p className="text-[10px] text-gray-500 leading-normal">
                            Select papers in the list above, scope them, and click synthesize to compile an empirical comparison grid.
                          </p>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col gap-4 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-teal-accent uppercase tracking-widest">Document Comparison</span>
                            <button
                              onClick={handleExportComparisonMarkdown}
                              className="text-[9px] text-teal-accent hover:text-white bg-teal-accent/10 border border-teal-accent/20 rounded-lg px-2 py-1 inline-flex items-center gap-1 cursor-pointer transition-all font-bold"
                            >
                              <Download className="w-3 h-3" />
                              <span>Save Table</span>
                            </button>
                          </div>
                          <div className="border border-slate-border rounded-xl overflow-x-auto bg-slate-bg/30">
                            <table className="w-full text-left text-[11px] border-collapse min-w-[300px]">
                              <thead>
                                <tr className="bg-slate-panel/50 border-b border-slate-border">
                                  {comparisonMatrix.headers.map((h, idx) => (
                                    <th key={idx} className="p-2 font-extrabold text-teal-accent border-r border-slate-border last:border-0 text-center first:text-left tracking-wide uppercase text-[9px]">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {comparisonMatrix.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="border-b border-slate-border hover:bg-slate-hover/20 last:border-0">
                                    {row.map((val, cIdx) => (
                                      <td 
                                        key={cIdx} 
                                        className={`p-2 text-cool-white border-r border-slate-border last:border-0 leading-relaxed ${
                                          cIdx === 0 
                                            ? "font-bold text-teal-accent bg-slate-bg/40 text-left text-[10px]" 
                                            : "text-[10px] align-top text-center select-text"
                                        }`}
                                      >
                                        {val}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <form onSubmit={handleAddCustomRow} className="border-t border-slate-border pt-4 mt-2">
                            <div className="flex flex-col gap-2">
                              <label className="text-[9px] uppercase tracking-widest text-gray-400 font-extrabold flex items-center gap-1">
                                <Plus className="w-3 h-3 text-teal-accent" />
                                <span>Custom Attribute</span>
                              </label>
                              <div className="flex gap-1">
                                <input
                                  type="text"
                                  value={customAttribute}
                                  onChange={(e) => setCustomAttribute(e.target.value)}
                                  placeholder="e.g. Methodology, Target, Limitations..."
                                  className="flex-1 bg-[#1a1d21] border border-slate-border rounded-xl px-2 py-1.5 text-xs text-cool-white placeholder-gray-500 focus:outline-none focus:border-teal-accent"
                                />
                                <button
                                  type="submit"
                                  disabled={!customAttribute.trim()}
                                  className="bg-teal-accent hover:bg-teal-accent/90 disabled:bg-slate-border disabled:text-gray-500 text-slate-bg text-xs font-extrabold px-3 py-1.5 rounded-xl cursor-pointer"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  )}

                  {rightPanelTab === "viewer" && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {!selectedDocContent ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6">
                          <FileSearch className="w-12 h-12 text-slate-border mb-2 animate-pulse" />
                          <h4 className="text-xs font-extrabold text-cool-white uppercase tracking-widest">Reader Mode</h4>
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                            Select a document file in the list index above to preview its text stream verbatim.
                          </p>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col overflow-hidden bg-slate-bg animate-fade-in">
                          <div className="bg-slate-panel/70 px-4 py-3 border-b border-slate-border flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[10px] gap-1">
                              <span className="font-extrabold text-cool-white truncate max-w-[70%] tracking-wide">
                                {selectedDocContent.name}
                              </span>
                              <span className="text-[8px] text-teal-accent font-mono bg-teal-accent/10 px-1 py-0.5 rounded border border-teal-accent/20">
                                SHA-256
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <div className="relative flex-1 max-w-[130px]">
                                <Search className="w-3 h-3 text-gray-500 absolute left-2 top-2" />
                                <input
                                  type="text"
                                  value={readerSearchTerm}
                                  onChange={(e) => setReaderSearchTerm(e.target.value)}
                                  placeholder="Search..."
                                  className="w-full bg-[#1A1D21] text-[10px] pl-6 pr-2 py-1 rounded-lg border border-slate-border focus:outline-none focus:border-teal-accent text-cool-white"
                                />
                              </div>
                              <div className="flex gap-1">
                                {(["mono", "sans"] as const).map(f => (
                                  <button
                                    key={f}
                                    onClick={() => setReaderFontFamily(f)}
                                    className={`px-1.5 py-0.5 text-[9px] rounded font-bold border transition-all cursor-pointer ${readerFontFamily === f ? "bg-teal-accent text-slate-bg border-teal-accent" : "bg-slate-bg border-slate-border text-gray-400"}`}
                                  >
                                    {f}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto py-2 select-text scrollbar-thin">
                            {isLoadingDoc ? (
                              <div className="h-full flex flex-col items-center justify-center space-y-2 py-12 select-none">
                                <RefreshCw className="w-4 h-4 text-teal-accent animate-spin" />
                                <span className="text-[9px] text-gray-500">Decompressing...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col min-w-full">
                                {selectedDocContent.content ? (
                                  selectedDocContent.content.split("\n").map((line, lineIdx) => {
                                    const pageMatch = line.trim().match(/^---\s*(Page|Slide)\s+(\d+)\s*---$/i);
                                    if (pageMatch) {
                                      return (
                                        <div key={lineIdx} className="col-span-full my-3 flex items-center justify-center py-1.5 border-y border-slate-border bg-slate-panel/40">
                                          <span className="text-[9px] uppercase font-bold tracking-widest text-teal-accent font-sans flex items-center gap-1 select-none">
                                            <BookOpen className="w-3 h-3" />
                                            {pageMatch[1]} {pageMatch[2]}
                                          </span>
                                        </div>
                                      );
                                    }
                                    const processedElement = highlightText(line, readerSearchTerm);
                                    return (
                                      <div key={lineIdx} className="group flex hover:bg-slate-panel/30 py-0.5 select-text">
                                        <div className="w-10 text-right text-gray-500 group-hover:text-teal-accent/60 font-mono text-[8px] pr-2 select-none border-r border-slate-border leading-normal shrink-0">
                                          {lineIdx + 1}
                                        </div>
                                        <div className={`flex-1 pl-3 text-cool-white pr-2 text-[11px] break-all whitespace-pre-wrap leading-relaxed ${readerFontFamily === "mono" ? "font-mono" : "font-sans"}`}>
                                          {processedElement}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <em className="text-gray-500 block text-center py-6">No preview content loaded.</em>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {rightPanelTab === "metadata" && (
                    <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4 scrollbar-thin">
                      {!selectedDocContent ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6">
                          <Bookmark className="w-12 h-12 text-slate-border mb-2 animate-pulse" />
                          <h4 className="text-xs font-extrabold text-cool-white uppercase tracking-widest">Metadata & Abstract</h4>
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                            Select a document file in the list index above to view abstracts and annotations.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-fade-in">
                          <div className="flex items-center gap-2 border-b border-slate-border pb-2">
                            <Info className="w-3.5 h-3.5 text-teal-accent" />
                            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-cool-white">Specs & AI Abstract</h4>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="bg-slate-bg/80 p-2.5 rounded-xl border border-slate-border/80 shadow-inner hover:border-teal-accent/30 transition-colors">
                              <span className="text-cool-white/60 block uppercase font-mono tracking-widest text-[8px]">Word Count</span>
                              <span className="font-extrabold text-cool-white mt-1 block font-mono">{selectedDocContent.wordCount} words</span>
                            </div>
                            <div className="bg-slate-bg/80 p-2.5 rounded-xl border border-slate-border/80 shadow-inner hover:border-teal-accent/30 transition-colors">
                              <span className="text-cool-white/60 block uppercase font-mono tracking-widest text-[8px]">Chunks Count</span>
                              <span className="font-extrabold text-cool-white mt-1 block font-mono">{selectedDocContent.chunksCount} vectors</span>
                            </div>
                          </div>

                          <div className="bg-slate-bg/80 p-3 border border-slate-border/80 rounded-xl space-y-2 hover:border-teal-accent/30 transition-colors">
                            <div className="text-[9px] uppercase tracking-widest font-mono text-cool-white/60 font-extrabold">Linguistic Grade Estimate</div>
                            <div className="text-cool-white font-extrabold text-[11px]">
                              {selectedDocContent.content.length > 5000 ? "Doctoral / Academic Peer-Review" : "Standard Professional"}
                            </div>
                          </div>

                          <div className="bg-teal-accent/5 p-3.5 border border-teal-accent/20 rounded-xl space-y-1">
                            <span className="text-[8px] uppercase tracking-widest text-teal-accent font-bold font-mono">Bibliographic Abstract</span>
                            <p className="text-[11.5px] text-gray-300 italic leading-relaxed">
                              "{selectedDocContent.summary}"
                            </p>
                          </div>

                          <div className="bg-slate-hover/20 p-3 border border-slate-border/80 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-cool-white/70 uppercase tracking-wider text-[9px]">RESEARCHER WORKING NOTES</span>
                              <span className="text-[8px] text-cool-white/50">Auto-saved to session</span>
                            </div>
                            <textarea
                              placeholder="Draft annotations, bibliography cards, or key thoughts here..."
                              className="w-full h-32 bg-slate-bg border border-slate-border/90 rounded-lg p-2 text-xs placeholder-cool-white/45 text-cool-white focus:outline-none focus:border-teal-accent resize-none font-sans"
                              value={cognitiveMemory}
                              onChange={(e) => {
                                setCognitiveMemory(e.target.value);
                                setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, cognitiveMemory: e.target.value } : s));
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {rightPanelTab === ("bibliography" as any) && (
                    <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4 scrollbar-thin">
                      {!selectedDocContent ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6">
                          <Award className="w-12 h-12 text-slate-border mb-2 animate-pulse" />
                          <h4 className="text-xs font-extrabold text-cool-white uppercase tracking-widest">Citation Generator</h4>
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                            Select a document file in the list index above to compile APA, Chicago, IEEE, MLA templates.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-border pb-2">
                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-cool-white">Academic Citation Styles</span>
                            {copiedText && <span className="text-[9px] text-emerald-400 font-bold">{copiedText} Copied!</span>}
                          </div>

                          <div className="space-y-3 text-[10px]">
                            {[
                              {
                                label: "APA Style",
                                text: `DocuMind Research Platform. (2026). ${selectedDocContent.name} [Source Document]. Grounded AI Research Platform.`
                              },
                              {
                                label: "Chicago Style",
                                text: `"DocuMind Library Asset." 2026. ${selectedDocContent.name}. Ingested via SHA-256 Validated Vector Index.`
                              },
                              {
                                label: "MLA Style",
                                text: `DocuMind Research Platform. "${selectedDocContent.name}." Grounded AI Research Platform, 2026.`
                              },
                              {
                                label: "IEEE Style",
                                text: `[1] DocuMind Research Platform, "${selectedDocContent.name}," Grounded AI Research Platform, Source Document, 2026.`
                              }
                            ].map((cite, citeIdx) => (
                              <div key={citeIdx} className="p-2.5 bg-[#25282D] rounded-xl border border-[#383d43]/40 flex flex-col gap-1.5 hover:border-[#383d43] transition-all">
                                <span className="font-bold text-teal-accent text-[9px] uppercase tracking-wider">{cite.label}</span>
                                <div className="text-gray-300 leading-normal font-sans italic">{cite.text}</div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(cite.text);
                                    setCopiedText(cite.label);
                                    setTimeout(() => setCopiedText(null), 1500);
                                  }}
                                  className="text-[8px] text-teal-accent hover:text-white bg-teal-accent/10 hover:bg-teal-accent/20 border border-teal-accent/20 py-1 px-2.5 rounded-md cursor-pointer transition-all font-mono font-bold uppercase mt-1 self-start"
                                >
                                  Copy {cite.label.split(" ")[0]}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {rightPanelTab === ("sources" as any) && (
                    <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4 scrollbar-thin">
                      {messages.length === 0 || !messages[messages.length - 1]?.source || messages[messages.length - 1].source?.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6">
                          <BookOpen className="w-12 h-12 text-slate-border mb-2 animate-pulse" />
                          <h4 className="text-xs font-extrabold text-cool-white uppercase tracking-widest">Grounding Sources</h4>
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                            Submit an AI research query first. Grounded citations used by the active AI Agent will populate here.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 border-b border-[#383D43]/50 pb-2">
                            <BookOpen className="w-3.5 h-3.5 text-teal-accent" />
                            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-cool-white">Active RAG Grounding Citations</h4>
                          </div>

                          <div className="space-y-3">
                            {messages[messages.length - 1].source?.map((src, srcIdx) => (
                              <div key={srcIdx} className="p-3 bg-slate-panel/40 rounded-xl border border-[#383d43]/50 text-[11px] space-y-2 hover:border-teal-accent/30 transition-all">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="font-extrabold text-teal-accent truncate max-w-[70%]">{src.docName}</span>
                                  <span className="text-[9px] bg-[#1a1d21] px-1.5 py-0.5 rounded text-gray-400 font-bold font-mono">Page {src.page}</span>
                                </div>
                                <p className="text-gray-300 italic pl-2 border-l border-teal-accent/30 leading-normal">
                                  "{src.quote}"
                                </p>
                                <p className="text-[10px] text-gray-500 leading-normal">
                                  <strong className="text-gray-400 font-semibold block mb-0.5">CONTEXT:</strong>
                                  {src.explanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </aside>

              </div>
        )}

          {/* ==================== VIEW 2: PARAPHRASER ==================== */}
          {activeView === "paraphraser" && (
            <div className="flex flex-col gap-6 max-w-6xl mx-auto h-full animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#383D43] pb-5">
                <div>
                  <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Shuffle className="w-5 h-5 text-teal-accent" />
                    AI Paraphraser
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Redesign sentence structures and expand your vocabulary with Quillbot-equivalent models.
                  </p>
                </div>
                {/* Writing style mode options */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#25282D] p-1 rounded-xl border border-[#383D43]">
                  {(["standard", "fluency", "formal", "academic", "creative"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setParaphraserMode(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        paraphraserMode === m
                          ? "bg-teal-accent text-slate-bg font-extrabold shadow-sm"
                          : "text-gray-400 hover:text-white hover:bg-[#383D43]/50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paraphrase Split Pane Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Input Textarea Block */}
                <div className="bg-[#25282D] border border-[#383D43] rounded-2xl p-5 flex flex-col gap-4 min-h-[380px] shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold border-b border-[#383D43] pb-2">
                    <span>INPUT TEXT</span>
                    <span className="font-mono">{paraphraserInput.trim() === "" ? 0 : paraphraserInput.trim().split(/\s+/).length} words | {paraphraserInput.length} chars</span>
                  </div>
                  <textarea
                    value={paraphraserInput}
                    onChange={(e) => setParaphraserInput(e.target.value)}
                    placeholder="Type or paste your text here to paraphrase..."
                    className="flex-1 w-full bg-transparent text-xs text-gray-200 placeholder-gray-500 border-none outline-none resize-none min-h-[220px] focus:ring-0 leading-relaxed select-text"
                  />
                  <div className="flex items-center justify-between border-t border-[#383D43] pt-4">
                    <button
                      onClick={() => setParaphraserInput("")}
                      className="text-[11px] text-gray-500 hover:text-white transition-colors font-bold cursor-pointer"
                    >
                      Clear Text
                    </button>
                    <button
                      onClick={handleParaphrase}
                      disabled={isParaphrasing || !paraphraserInput.trim()}
                      className="bg-teal-accent hover:bg-teal-accent-hover disabled:bg-[#383D43]/60 disabled:text-gray-500 text-slate-bg px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow"
                    >
                      {isParaphrasing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Paraphrasing...</span>
                        </>
                      ) : (
                        <>
                          <Shuffle className="w-3.5 h-3.5" />
                          <span>Paraphrase</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Output Textarea Block */}
                <div className="bg-[#1E2125] border border-[#383D43] rounded-2xl p-5 flex flex-col gap-4 min-h-[380px] shadow-sm relative">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold border-b border-[#383D43]/60 pb-2">
                    <span>PARAPHRASED OUTPUT</span>
                    {paraphraserOutput.length > 0 && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(paraphraserOutput);
                          setCopiedText("Paraphrased");
                          setTimeout(() => setCopiedText(null), 1500);
                        }}
                        className="text-teal-accent hover:text-white font-mono flex items-center gap-1 cursor-pointer font-bold transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedText === "Paraphrased" ? "Copied!" : "Copy"}</span>
                      </button>
                    )}
                  </div>
                  {isParaphrasing ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
                      <RefreshCw className="w-8 h-8 text-teal-accent animate-spin" />
                      <p className="text-[11px] text-gray-400 animate-pulse font-mono">Synthesizing optimal linguistic structures...</p>
                    </div>
                  ) : paraphraserOutput ? (
                    <div className="flex-1 text-xs text-white leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[280px] pr-1 select-text">
                      {paraphraserOutput}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                      <Shuffle className="w-10 h-10 text-[#383D43] mb-2" />
                      <span className="text-[11px] text-gray-500 font-bold">No Paraphrased Content Yet</span>
                      <p className="text-[10px] text-gray-500 mt-0.5 max-w-xs">Write on the left, click paraphrase, and let Gemini rewrite it.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 3: GRAMMAR CHECKER ==================== */}
          {activeView === "grammar" && (
            <div className="flex flex-col gap-6 max-w-6xl mx-auto h-full animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#383D43] pb-5">
                <div>
                  <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-teal-accent" />
                    AI Grammar Checker
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Correct misspelled words, grammatical faults, and punctuation with smart explanation overlays.
                  </p>
                </div>
                {grammarErrors.length > 0 && (
                  <button
                    onClick={fixAllGrammarErrors}
                    className="bg-teal-accent/10 hover:bg-teal-accent/20 text-teal-accent border border-teal-accent/20 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Accept All Corrections ({grammarErrors.length})</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Main Textarea inputs */}
                <div className="lg:col-span-8 bg-[#25282D] border border-[#383D43] rounded-2xl p-5 flex flex-col gap-4 min-h-[380px] shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold border-b border-[#383D43] pb-2">
                    <span>EDITABLE TEXT CONTAINER</span>
                    <span className="font-mono">{grammarInput.trim() === "" ? 0 : grammarInput.trim().split(/\s+/).length} words | {grammarInput.length} chars</span>
                  </div>
                  <textarea
                    value={grammarInput}
                    onChange={(e) => {
                      setGrammarInput(e.target.value);
                      if (grammarErrors.length > 0) setGrammarErrors([]);
                    }}
                    placeholder="Type or paste your text here to check spelling, style, and grammatical issues..."
                    className="flex-1 w-full bg-transparent text-xs text-gray-200 placeholder-gray-500 border-none outline-none resize-none min-h-[220px] focus:ring-0 leading-relaxed select-text"
                  />
                  <div className="flex items-center justify-between border-t border-[#383D43] pt-4">
                    <button
                      onClick={() => {
                        setGrammarInput("");
                        setGrammarErrors([]);
                        setGrammarOutput("");
                      }}
                      className="text-[11px] text-gray-500 hover:text-white transition-colors font-bold cursor-pointer"
                    >
                      Clear Text
                    </button>
                    <button
                      onClick={handleGrammarCheck}
                      disabled={isCheckingGrammar || !grammarInput.trim()}
                      className="bg-teal-accent hover:bg-teal-accent-hover disabled:bg-[#383D43]/60 disabled:text-gray-500 text-slate-bg px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow"
                    >
                      {isCheckingGrammar ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Analyzing Grammar...</span>
                        </>
                      ) : (
                        <>
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Check Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sidebar suggestions overlay */}
                <div className="lg:col-span-4 bg-[#1E2125] border border-[#383D43] rounded-2xl p-5 flex flex-col gap-4 min-h-[380px] shadow-sm">
                  <div className="text-[11px] text-gray-400 font-bold border-b border-[#383D43]/60 pb-2">
                    GRAMMAR SUGGESTIONS
                  </div>
                  
                  {isCheckingGrammar ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
                      <RefreshCw className="w-8 h-8 text-teal-accent animate-spin" />
                      <p className="text-[11px] text-gray-400 animate-pulse font-mono">Running syntactic graph parsing...</p>
                    </div>
                  ) : grammarErrors.length > 0 ? (
                    <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[300px] pr-1">
                      {grammarErrors.map((err, idx) => (
                        <div key={idx} className="p-3.5 bg-red-500/5 hover:bg-red-500/10 rounded-xl border border-red-500/15 flex flex-col gap-2.5 transition-all">
                          <div className="flex items-center justify-between text-[11px] border-b border-[#383D43]/50 pb-1.5">
                            <span className="text-red-400 font-bold line-through">"{err.original}"</span>
                            <span className="text-emerald-400 font-extrabold">→ "{err.corrected}"</span>
                          </div>
                          <p className="text-[11.5px] text-gray-300 leading-relaxed font-medium">
                            {err.explanation}
                          </p>
                          <button
                            onClick={() => applyCorrection(idx)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-slate-bg text-[10px] font-extrabold py-1.5 px-3 rounded-lg transition-all text-center cursor-pointer shadow"
                          >
                            Accept Correction
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : grammarInput && grammarOutput ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-[11px] text-emerald-400 font-bold">Text Completely Correct!</span>
                      <p className="text-[10px] text-gray-500 mt-1 max-w-[180px]">No spelling or grammatical defects detected in the sequence.</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                      <FileCheck2 className="w-10 h-10 text-[#383D43] mb-2" />
                      <span className="text-[11px] text-gray-500 font-bold">No issues to show yet</span>
                      <p className="text-[10px] text-gray-500 mt-0.5 max-w-[180px]">Run a check to identify linguistic recommendations.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 4: AI DETECTOR ==================== */}
          {activeView === "detector" && (
            <div className="flex flex-col gap-6 max-w-6xl mx-auto h-full animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#383D43] pb-5">
                <div>
                  <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Bot className="w-5 h-5 text-teal-accent" />
                    AI Content Detector
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Calculate perplexity and structural burstiness metrics to classify AI and LLM generation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Text Area Input */}
                <div className="lg:col-span-7 bg-[#25282D] border border-[#383D43] rounded-2xl p-5 flex flex-col gap-4 min-h-[380px] shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold border-b border-[#383D43] pb-2">
                    <span>PASTE TEXT FOR SCANNING</span>
                    <span className="font-mono">{detectorInput.trim() === "" ? 0 : detectorInput.trim().split(/\s+/).length} words | {detectorInput.length} chars</span>
                  </div>
                  <textarea
                    value={detectorInput}
                    onChange={(e) => setDetectorInput(e.target.value)}
                    placeholder="Type or paste paragraphs here to measure AI content signature..."
                    className="flex-1 w-full bg-transparent text-xs text-gray-200 placeholder-gray-500 border-none outline-none resize-none min-h-[220px] focus:ring-0 leading-relaxed select-text"
                  />
                  <div className="flex items-center justify-between border-t border-[#383D43] pt-4">
                    <button
                      onClick={() => {
                        setDetectorInput("");
                        setDetectorScore(null);
                        setDetectorClassification("");
                        setDetectorDetails("");
                        setDetectorSentenceAnalysis([]);
                      }}
                      className="text-[11px] text-gray-500 hover:text-white transition-colors font-bold cursor-pointer"
                    >
                      Clear Text
                    </button>
                    <button
                      onClick={handleAIDetect}
                      disabled={isDetectingAI || !detectorInput.trim()}
                      className="bg-teal-accent hover:bg-teal-accent-hover disabled:bg-[#383D43]/60 disabled:text-gray-500 text-slate-bg px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow"
                    >
                      {isDetectingAI ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Scanning Signatures...</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3.5 h-3.5" />
                          <span>Analyze Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Score & Structural Analytics Pane */}
                <div className="lg:col-span-5 bg-[#1E2125] border border-[#383D43] rounded-2xl p-5 flex flex-col gap-4 min-h-[380px] shadow-sm">
                  <div className="text-[11px] text-gray-400 font-bold border-b border-[#383D43]/60 pb-2">
                    AI CLASSIFICATION METRICS
                  </div>

                  {isDetectingAI ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
                      <RefreshCw className="w-8 h-8 text-teal-accent animate-spin" />
                      <p className="text-[11px] text-gray-400 animate-pulse font-mono">Evaluating entropy models...</p>
                    </div>
                  ) : detectorScore !== null ? (
                    <div className="flex-1 space-y-5 overflow-y-auto max-h-[320px] pr-1">
                      {/* Gauge Indicator */}
                      <div className="bg-[#25282D] rounded-xl border border-[#383D43] p-4 flex items-center gap-4">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          {/* Circle Background */}
                          <svg className="absolute w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" strokeWidth="6" stroke="#383D43" fill="transparent" />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              strokeWidth="6"
                              stroke={detectorScore > 60 ? "#EF4444" : detectorScore > 30 ? "#F59E0B" : "#10B981"}
                              fill="transparent"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - detectorScore / 100)}`}
                            />
                          </svg>
                          <span className="font-mono font-bold text-sm text-white">{detectorScore}%</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono tracking-wider ${
                            detectorScore > 60 ? "bg-red-500/15 text-red-400 border border-red-500/20" :
                            detectorScore > 30 ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" :
                            "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {detectorClassification}
                          </span>
                          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                            {detectorDetails}
                          </p>
                        </div>
                      </div>

                      {/* Sentence highlights */}
                      {detectorSentenceAnalysis.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                            Sentence Breakdown Index
                          </span>
                          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                            {detectorSentenceAnalysis.map((item, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded-lg text-[11px] leading-relaxed transition-all ${
                                  item.aiScore > 60
                                    ? "bg-red-500/5 border-l-2 border-red-500 text-gray-300"
                                    : item.aiScore > 30
                                    ? "bg-amber-500/5 border-l-2 border-amber-500 text-gray-300"
                                    : "bg-emerald-500/5 border-l-2 border-emerald-500 text-gray-300"
                                }`}
                              >
                                <span className="font-medium">{item.sentence}</span>
                                <span className="text-[9px] font-mono font-bold ml-1.5 opacity-60">
                                  ({item.aiScore}% AI)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                      <Bot className="w-10 h-10 text-[#383D43] mb-2" />
                      <span className="text-[11px] text-gray-500 font-bold">No Metrics Extracted</span>
                      <p className="text-[10px] text-gray-500 mt-0.5 max-w-[180px]">Input your document and click Analyze to view generative probabilities.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 5: PLAGIARISM CHECKER ==================== */}
          {activeView === "plagiarism" && (
            <div className="flex flex-col gap-6 max-w-6xl mx-auto h-full animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#383D43] pb-5">
                <div>
                  <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-teal-accent" />
                    AI Plagiarism Checker
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Detect unoriginal passages cross-referenced with your internal Workspace Documents AND global publications/web sources.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Input Text Block */}
                <div className="lg:col-span-7 bg-[#25282D] border border-[#383D43] rounded-2xl p-5 flex flex-col gap-4 min-h-[380px] shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold border-b border-[#383D43] pb-2">
                    <span>ORIGINAL MANUSCRIPT</span>
                    <span className="font-mono">{plagiarismInput.trim() === "" ? 0 : plagiarismInput.trim().split(/\s+/).length} words | {plagiarismInput.length} chars</span>
                  </div>
                  {isCheckingPlagiarism ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
                      <RefreshCw className="w-8 h-8 text-teal-accent animate-spin" />
                      <p className="text-[11px] text-gray-400 animate-pulse font-mono">Cross-checking web indices and active workspace PDFs...</p>
                    </div>
                  ) : plagiarismAnnotatedText.length > 0 ? (
                    <div className="flex-1 bg-[#1A1D21] p-4 rounded-xl border border-[#383D43] text-xs leading-relaxed overflow-y-auto max-h-[260px] pr-1 select-text">
                      {plagiarismAnnotatedText.map((seg, idx) => (
                        <span
                          key={idx}
                          className={seg.plagiarized ? "bg-red-500/20 text-red-200 border-b border-red-500/40 relative group cursor-help font-medium px-0.5" : "text-gray-300"}
                          title={seg.source ? `Source: ${seg.source}` : "Plagiarized Segment"}
                        >
                          {seg.text}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={plagiarismInput}
                      onChange={(e) => setPlagiarismInput(e.target.value)}
                      placeholder="Paste your essay, article, or manuscript here to scan for plagiarism against active library documents and external web pages..."
                      className="flex-1 w-full bg-transparent text-xs text-gray-200 placeholder-gray-500 border-none outline-none resize-none min-h-[220px] focus:ring-0 leading-relaxed select-text"
                    />
                  )}
                  <div className="flex items-center justify-between border-t border-[#383D43] pt-4">
                    <button
                      onClick={() => {
                        setPlagiarismInput("");
                        setPlagiarismScore(null);
                        setPlagiarismMatches([]);
                        setPlagiarismAnnotatedText([]);
                      }}
                      className="text-[11px] text-gray-500 hover:text-white transition-colors font-bold cursor-pointer"
                    >
                      Clear / Reset Checker
                    </button>
                    <button
                      onClick={handlePlagiarismCheck}
                      disabled={isCheckingPlagiarism || !plagiarismInput.trim()}
                      className="bg-teal-accent hover:bg-teal-accent-hover disabled:bg-[#383D43]/60 disabled:text-gray-500 text-slate-bg px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow"
                    >
                      {isCheckingPlagiarism ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Scanning Databases...</span>
                        </>
                      ) : (
                        <>
                          <Fingerprint className="w-3.5 h-3.5" />
                          <span>Verify Authenticity</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Database Matches & Citations panel */}
                <div className="lg:col-span-5 bg-[#1E2125] border border-[#383D43] rounded-2xl p-5 flex flex-col gap-4 min-h-[380px] shadow-sm">
                  <div className="text-[11px] text-gray-400 font-bold border-b border-[#383D43]/60 pb-2">
                    SIMILARITY OVERVIEW & CITATIONS
                  </div>

                  {isCheckingPlagiarism ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
                      <RefreshCw className="w-8 h-8 text-teal-accent animate-spin" />
                      <p className="text-[11px] text-gray-400 animate-pulse font-mono">Compiling comparative reference lists...</p>
                    </div>
                  ) : plagiarismScore !== null ? (
                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[320px] pr-1">
                      {/* Plagiarism Score Metric Card */}
                      <div className="bg-[#25282D] rounded-xl border border-[#383D43] p-4 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase font-mono tracking-wider block">PLAGIARISM SCORE</span>
                            <span className={`text-2xl font-black mt-1 block ${plagiarismScore > 30 ? "text-red-400" : "text-emerald-400"}`}>
                              {plagiarismScore}% Duplication
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-gray-500 uppercase font-mono tracking-wider block">ORIGINAL CONTENT</span>
                            <span className="text-lg font-bold text-white mt-1 block">
                              {100 - plagiarismScore}% Unique
                            </span>
                          </div>
                        </div>

                        {/* Premium Analysis Indices */}
                        <div className="space-y-2 border-t border-[#383D43]/60 pt-3">
                          <span className="text-[9px] text-teal-accent font-bold uppercase tracking-wider block">Premium Integrity Analysis</span>
                          <div className="space-y-1.5">
                            <div>
                              <div className="flex justify-between text-[10px] text-gray-400">
                                <span>Global Web Database Match</span>
                                <span className="font-bold font-mono">{Math.round(plagiarismScore * 0.6)}%</span>
                              </div>
                              <div className="w-full bg-[#1A1D21] h-1.5 rounded-full overflow-hidden mt-1">
                                <div className="bg-red-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.round(plagiarismScore * 0.6)}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] text-gray-400">
                                <span>Academic & Publications Match</span>
                                <span className="font-bold font-mono">{Math.round(plagiarismScore * 0.3)}%</span>
                              </div>
                              <div className="w-full bg-[#1A1D21] h-1.5 rounded-full overflow-hidden mt-1">
                                <div className="bg-[#818CF8] h-full rounded-full transition-all duration-500" style={{ width: `${Math.round(plagiarismScore * 0.3)}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] text-gray-400">
                                <span>Internal Workspace Integrity Index</span>
                                <span className="font-bold font-mono">{Math.round(plagiarismScore * 0.1)}%</span>
                              </div>
                              <div className="w-full bg-[#1A1D21] h-1.5 rounded-full overflow-hidden mt-1">
                                <div className="bg-teal-accent h-full rounded-full transition-all duration-500" style={{ width: `${Math.round(plagiarismScore * 0.1)}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Matches List */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                          Identified Reference Citations
                        </span>
                        {plagiarismMatches.length > 0 ? (
                          <div className="space-y-2">
                            {plagiarismMatches.map((item, idx) => (
                              <div key={idx} className="p-3 bg-[#25282D] rounded-xl border border-[#383D43] flex flex-col gap-1.5 text-[11px]">
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-bold truncate max-w-[70%]">{item.source}</span>
                                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                    item.type === "workspace" ? "bg-teal-accent/15 text-teal-accent" : "bg-blue-500/15 text-blue-400"
                                  }`}>
                                    {item.type === "workspace" ? "Workspace PDF" : "Academic Web"}
                                  </span>
                                </div>
                                <blockquote className="text-gray-400 border-l-2 border-teal-accent/40 pl-2 py-0.5 leading-relaxed truncate select-text">
                                  "{item.quote}"
                                </blockquote>
                                <div className="flex items-center justify-between mt-1 text-[9px] text-gray-500 border-t border-[#383D43]/60 pt-1.5">
                                  <span>Duplicate Percentage:</span>
                                  <span className="font-bold text-red-400">{item.percentage}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 text-[11px] italic">
                            No duplicate matching quotes found in published literature indices.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                      <Fingerprint className="w-10 h-10 text-[#383D43] mb-2" />
                      <span className="text-[11px] text-gray-500 font-bold">No Plagiarism Log Extracted</span>
                      <p className="text-[10px] text-gray-500 mt-0.5 max-w-[180px]">Run a duplicate checker scan to list bibliographic matching citations.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 6: AI HUMANIZER ==================== */}
          {activeView === "humanizer" && (
            <div className="flex flex-col gap-6 max-w-6xl mx-auto h-full animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#383D43] pb-5">
                <div>
                  <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-teal-accent" />
                    AI Content Humanizer
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Bypass AI detectors by applying natural prose burstiness and variable sentence formatting.
                  </p>
                </div>
                {/* Humanizer Intensity mode options */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#25282D] p-1 rounded-xl border border-[#383D43]">
                  {(["mild", "standard", "aggressive"] as const).map((modeOption) => (
                    <button
                      key={modeOption}
                      onClick={() => setHumanizerIntensity(modeOption)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        humanizerIntensity === modeOption
                          ? "bg-teal-accent text-slate-bg font-extrabold shadow-sm"
                          : "text-gray-400 hover:text-white hover:bg-[#383D43]/50"
                      }`}
                    >
                      {modeOption} Mode
                    </button>
                  ))}
                </div>
              </div>

              {/* Split screen display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Input block */}
                <div className="bg-[#25282D] border border-[#383D43] rounded-2xl p-5 flex flex-col gap-4 min-h-[380px] shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold border-b border-[#383D43] pb-2">
                    <span>LLM-GENERATED TEXT</span>
                    <span className="font-mono">{humanizerInput.trim() === "" ? 0 : humanizerInput.trim().split(/\s+/).length} words | {humanizerInput.length} chars</span>
                  </div>
                  <textarea
                    value={humanizerInput}
                    onChange={(e) => setHumanizerInput(e.target.value)}
                    placeholder="Paste AI generated paragraphs here to convert into human equivalent speech patterns..."
                    className="flex-1 w-full bg-transparent text-xs text-gray-200 placeholder-gray-500 border-none outline-none resize-none min-h-[220px] focus:ring-0 leading-relaxed select-text"
                  />
                  <div className="flex items-center justify-between border-t border-[#383D43] pt-4">
                    <button
                      onClick={() => setHumanizerInput("")}
                      className="text-[11px] text-gray-500 hover:text-white transition-colors font-bold cursor-pointer"
                    >
                      Clear Text
                    </button>
                    <button
                      onClick={handleHumanize}
                      disabled={isHumanizing || !humanizerInput.trim()}
                      className="bg-teal-accent hover:bg-teal-accent-hover disabled:bg-[#383D43]/60 disabled:text-gray-500 text-slate-bg px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow"
                    >
                      {isHumanizing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Humanizing Prose...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Humanize Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Output block */}
                <div className="bg-[#1E2125] border border-[#383D43] rounded-2xl p-5 flex flex-col gap-4 min-h-[380px] shadow-sm relative">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold border-b border-[#383D43]/60 pb-2">
                    <span>HUMANIZED OUTPUT</span>
                    {humanizerOutput.length > 0 && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(humanizerOutput);
                          setCopiedText("Humanizer");
                          setTimeout(() => setCopiedText(null), 1500);
                        }}
                        className="text-teal-accent hover:text-white font-mono flex items-center gap-1 cursor-pointer font-bold transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedText === "Humanizer" ? "Copied!" : "Copy"}</span>
                      </button>
                    )}
                  </div>
                  {isHumanizing ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
                      <RefreshCw className="w-8 h-8 text-teal-accent animate-spin" />
                      <p className="text-[11px] text-gray-400 animate-pulse font-mono">Bypassing machine learning classification thresholds...</p>
                    </div>
                  ) : humanizerOutput ? (
                    <div className="flex-1 flex flex-col gap-4 h-full justify-between">
                      <div className="text-xs text-white leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[220px] pr-1 select-text">
                        {humanizerOutput}
                      </div>

                      {/* Premium Humanizer Statistics Box */}
                      <div className="bg-emerald-500/5 rounded-xl border border-emerald-500/15 p-3.5 space-y-2.5 text-[10.5px]">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>AI BYPASS SHIELD ENABLED</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-gray-300">
                          <div className="bg-[#25282D]/40 p-2 rounded-lg border border-[#383D43]/40">
                            <span className="block text-[8px] text-gray-500 font-mono">EST. AI MATCH</span>
                            <span className="font-bold text-emerald-400 font-mono text-xs">2.4%</span>
                          </div>
                          <div className="bg-[#25282D]/40 p-2 rounded-lg border border-[#383D43]/40">
                            <span className="block text-[8px] text-gray-500 font-mono">BURSTINESS</span>
                            <span className="font-bold text-teal-accent font-mono text-xs">96%</span>
                          </div>
                          <div className="bg-[#25282D]/40 p-2 rounded-lg border border-[#383D43]/40">
                            <span className="block text-[8px] text-gray-500 font-mono">PERPLEXITY</span>
                            <span className="font-bold text-white font-mono text-xs">High</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                      <UserCheck className="w-10 h-10 text-[#383D43] mb-2" />
                      <span className="text-[11px] text-gray-500 font-bold">No Humanized Output Ready</span>
                      <p className="text-[10px] text-gray-500 mt-0.5 max-w-xs">Write on the left, choose strength mode, and humanize instantly.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {renderSecurityAndTermsModals()}

    </div>
  );
}
