import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Medal, Crown, Swords, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RankingEntry {
  id: string;
  user_id: string;
  display_name: string;
  avatar_emoji: string;
  training_days: number;
  total_points: number;
  week_start: string;
}

const AVATAR_EMOJIS = ["⚽", "🏆", "🦁", "🔥", "⭐", "🎯", "💪", "🐺", "🦅", "👑", "🏃", "⚡"];

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

function getRankIcon(index: number) {
  if (index === 0) return <Crown className="w-5 h-5 text-primary" />;
  if (index === 1) return <Medal className="w-5 h-5 text-muted-foreground" />;
  if (index === 2) return <Medal className="w-5 h-5 text-accent-foreground" />;
  return <span className="text-xs font-bold text-muted-foreground w-5 text-center">{index + 1}º</span>;
}

function getRankBg(index: number) {
  if (index === 0) return "bg-yellow-400/10 border-yellow-400/30";
  if (index === 1) return "bg-gray-300/10 border-gray-300/30";
  if (index === 2) return "bg-amber-600/10 border-amber-600/30";
  return "bg-muted/20 border-border/20";
}

const Ranking = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEntry, setUserEntry] = useState<RankingEntry | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState("⚽");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const weekStart = getWeekStart();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    fetchRankings();
  }, [user, authLoading, navigate]);

  const fetchRankings = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("weekly_rankings")
      .select("*")
      .eq("week_start", weekStart)
      .order("total_points", { ascending: false });

    if (!error && data) {
      setRankings(data as RankingEntry[]);
      const mine = (data as RankingEntry[]).find((r) => r.user_id === user.id);
      if (mine) {
        setUserEntry(mine);
        setSelectedEmoji(mine.avatar_emoji);
      }
    }
    setLoading(false);
  };

  const syncMyScore = async () => {
    if (!user) return;

    // Count distinct training days this week from completed_trainings + training_sessions
    const weekStartDate = new Date(weekStart);
    const weekEnd = new Date(weekStartDate);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const [{ data: completed }, { data: sessions }, { data: profile }] = await Promise.all([
      supabase
        .from("completed_trainings")
        .select("completed_at")
        .eq("user_id", user.id)
        .gte("completed_at", weekStartDate.toISOString())
        .lt("completed_at", weekEnd.toISOString()),
      supabase
        .from("training_sessions")
        .select("completed_at")
        .eq("user_id", user.id)
        .gte("completed_at", weekStartDate.toISOString())
        .lt("completed_at", weekEnd.toISOString()),
      supabase.from("profiles").select("name").eq("user_id", user.id).single(),
    ]);

    const allDates = new Set<string>();
    completed?.forEach((c) => allDates.add(new Date(c.completed_at).toISOString().split("T")[0]));
    sessions?.forEach((s) => allDates.add(new Date(s.completed_at).toISOString().split("T")[0]));

    const trainingDays = allDates.size;
    const totalPoints = trainingDays * 10 + (completed?.length || 0) * 5 + (sessions?.length || 0) * 8;
    const displayName = profile?.name || user.email?.split("@")[0] || "Jogador";

    if (userEntry) {
      await supabase
        .from("weekly_rankings")
        .update({
          training_days: trainingDays,
          total_points: totalPoints,
          display_name: displayName,
          avatar_emoji: selectedEmoji,
        })
        .eq("id", userEntry.id);
    } else {
      await supabase.from("weekly_rankings").insert({
        user_id: user.id,
        week_start: weekStart,
        training_days: trainingDays,
        total_points: totalPoints,
        display_name: displayName,
        avatar_emoji: selectedEmoji,
      });
    }

    toast.success("Ranking atualizado!");
    fetchRankings();
  };

  const updateEmoji = async (emoji: string) => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
    if (userEntry) {
      await supabase
        .from("weekly_rankings")
        .update({ avatar_emoji: emoji })
        .eq("id", userEntry.id);
      fetchRankings();
    }
  };

  const maxPoints = rankings.length > 0 ? rankings[0].total_points : 1;

  return (
    <div className="min-h-screen bg-background pb-20 page-enter">
      {/* Header */}
      <div className="gradient-header relative overflow-hidden px-4 pt-6 pb-8">
        <div className="gradient-header-accent absolute inset-0 pointer-events-none" />
        <div className="relative max-w-md mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2 animate-fade-in">
            <Trophy className="w-7 h-7 text-primary" />
            <h1 className="page-title text-foreground">Ranking Semanal</h1>
          </div>
          <p className="text-sm text-muted-foreground animate-fade-in">
            Semana de {new Date(weekStart).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          </p>

          {/* Sync button */}
          <Button
            onClick={syncMyScore}
            size="sm"
            className="mt-3 bg-primary hover:bg-primary/90 font-semibold animate-fade-in"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Atualizar meu score
          </Button>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto -mt-3">
        {/* Avatar picker */}
        <div className="gradient-card rounded-xl border border-border/20 p-4 mb-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
              >
                {selectedEmoji}
              </button>
              <div>
                <p className="text-sm font-semibold text-foreground">Seu avatar</p>
                <p className="text-[10px] text-muted-foreground">Toque para trocar</p>
              </div>
            </div>
            {userEntry && (
              <div className="text-right">
                <p className="text-lg font-heading font-bold text-primary">{userEntry.total_points} pts</p>
                <p className="text-[10px] text-muted-foreground">{userEntry.training_days} dias treinados</p>
              </div>
            )}
          </div>

          {showEmojiPicker && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/20 animate-fade-in">
              {AVATAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => updateEmoji(emoji)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110",
                    selectedEmoji === emoji ? "bg-primary/30 ring-2 ring-primary" : "bg-muted/30"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : rankings.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <Swords className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-1">Nenhum ranking ainda esta semana</p>
            <p className="text-xs text-muted-foreground">Clique em "Atualizar meu score" para entrar!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rankings.map((entry, i) => {
              const isMe = entry.user_id === user?.id;
              const barWidth = maxPoints > 0 ? (entry.total_points / maxPoints) * 100 : 0;

              return (
                <div
                  key={entry.id}
                  className={cn(
                    "rounded-xl border p-3 transition-all animate-slide-up",
                    getRankBg(i),
                    isMe && "ring-2 ring-primary/50"
                  )}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(i)}
                    <span className="text-2xl">{entry.avatar_emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "text-sm font-semibold truncate",
                          isMe ? "text-primary" : "text-foreground"
                        )}>
                          {entry.display_name} {isMe && "(você)"}
                        </span>
                        <span className="text-sm font-heading font-bold text-foreground ml-2">
                          {entry.total_points} pts
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={barWidth} className="h-1.5 flex-1" />
                        <div className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-destructive" />
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {entry.training_days}d
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* How points work */}
        <div className="mt-6 gradient-card rounded-xl border border-border/20 p-4 animate-fade-in">
          <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Como funciona a pontuação</h3>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p>🗓️ Dia treinado = <span className="font-semibold text-foreground">10 pts</span></p>
            <p>✅ Treino completo = <span className="font-semibold text-foreground">5 pts</span></p>
            <p>🏋️ Sessão de treino = <span className="font-semibold text-foreground">8 pts</span></p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Ranking;
