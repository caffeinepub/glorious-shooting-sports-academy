import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import {
  useGetScores,
  useAddScore,
  useDeleteScore,
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
  useGetCallerUserRole,
  useGrantAdminRole,
} from '../hooks/useQueries';
import { Discipline, UserRole } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Target,
  Plus,
  Trash2,
  LogOut,
  Trophy,
  Users,
  Loader2,
  ShieldAlert,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';

function generateId(): string {
  return `score_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function AdminDashboard() {
  const { identity, clear } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  // Actor readiness
  const { isFetching: actorFetching } = useActor();

  // Profile
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [profileName, setProfileName] = useState('');
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  // Role
  const { data: callerRole } = useGetCallerUserRole();
  const isOwner = callerRole === UserRole.admin;

  // Scores
  const { data: scores = [], isLoading: scoresLoading } = useGetScores();
  const addScore = useAddScore();
  const deleteScore = useDeleteScore();

  // Grant admin
  const grantAdminRole = useGrantAdminRole();
  const [adminPrincipal, setAdminPrincipal] = useState('');
  const [adminGrantSuccess, setAdminGrantSuccess] = useState('');
  const [adminGrantError, setAdminGrantError] = useState('');

  // Form state
  const [form, setForm] = useState({
    shooterName: '',
    discipline: Discipline.Rifle as Discipline,
    distance: '',
    scoreValue: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [formError, setFormError] = useState('');

  // Redirect if not authenticated
  if (!isAuthenticated && !profileLoading) {
    navigate({ to: '/login' });
    return null;
  }

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim()) return;
    await saveProfile.mutateAsync({ name: profileName.trim() });
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (actorFetching) {
      setFormError('Backend is still connecting. Please wait a moment and try again.');
      return;
    }

    if (!form.shooterName.trim()) { setFormError('Shooter name is required.'); return; }
    if (!form.distance || isNaN(Number(form.distance)) || Number(form.distance) <= 0) {
      setFormError('Please enter a valid distance.');
      return;
    }
    if (!form.scoreValue || isNaN(Number(form.scoreValue)) || Number(form.scoreValue) < 0) {
      setFormError('Please enter a valid score.');
      return;
    }
    if (!form.date) { setFormError('Date is required.'); return; }

    try {
      await addScore.mutateAsync({
        id: generateId(),
        shooterName: form.shooterName.trim(),
        discipline: form.discipline,
        distance: BigInt(form.distance),
        scoreValue: BigInt(form.scoreValue),
        date: form.date,
      });
      setForm({
        shooterName: '',
        discipline: Discipline.Rifle,
        distance: '',
        scoreValue: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('only admins')) {
        setFormError('You do not have admin privileges to add scores.');
      } else if (msg.toLowerCase().includes('not available') || msg.toLowerCase().includes('initializing')) {
        setFormError(msg);
      } else {
        setFormError('Failed to add score. Please ensure you have admin privileges and try again.');
      }
    }
  };

  const handleDeleteScore = async (id: string) => {
    try {
      await deleteScore.mutateAsync(id);
    } catch (err: any) {
      console.error('Delete error:', err);
    }
  };

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminGrantSuccess('');
    setAdminGrantError('');

    if (!adminPrincipal.trim()) {
      setAdminGrantError('Please enter a principal ID.');
      return;
    }

    try {
      await grantAdminRole.mutateAsync(adminPrincipal.trim());
      setAdminGrantSuccess(`Admin role successfully granted to principal: ${adminPrincipal.trim()}`);
      setAdminPrincipal('');
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('invalid principal') || msg.toLowerCase().includes('invalid')) {
        setAdminGrantError('Invalid principal ID format. Please enter a valid Internet Identity principal.');
      } else if (msg.toLowerCase().includes('unauthorized')) {
        setAdminGrantError('You do not have permission to grant admin roles.');
      } else if (msg.toLowerCase().includes('initializing') || msg.toLowerCase().includes('not available')) {
        setAdminGrantError(msg);
      } else {
        setAdminGrantError('Failed to grant admin role. Please check the principal ID and try again.');
      }
    }
  };

  const totalShooters = new Set(scores.map((s) => s.shooterName)).size;

  const isFormDisabled = actorFetching || addScore.isPending;

  return (
    <div className="min-h-screen bg-navy-950 py-10">
      {/* Profile Setup Dialog */}
      <Dialog open={showProfileSetup}>
        <DialogContent className="bg-navy-900 border-gold-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl uppercase tracking-wide text-gold-400">
              Welcome! Set Up Your Profile
            </DialogTitle>
            <DialogDescription className="text-foreground/60">
              Please enter your name to complete your profile setup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="profile-name" className="text-foreground/80 text-sm">Your Name</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1 bg-navy-950 border-gold-500/30 text-white placeholder:text-foreground/30"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={!profileName.trim() || saveProfile.isPending}
              className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold"
            >
              {saveProfile.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</>
              ) : 'Save Profile'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Admin <span className="text-gold-400">Dashboard</span>
            </h1>
            {userProfile && (
              <p className="text-foreground/50 text-sm mt-1">
                Welcome back, <span className="text-gold-400 font-medium">{userProfile.name}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {actorFetching && (
              <div className="flex items-center gap-1.5 text-xs text-foreground/50 bg-navy-900 border border-gold-500/20 rounded px-3 py-1.5">
                <Loader2 className="h-3 w-3 animate-spin text-gold-400" />
                <span>Connecting to backend…</span>
              </div>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-gold-500/30 text-foreground/70 hover:text-destructive hover:border-destructive/50 gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-navy-900 border border-gold-500/20 rounded-lg p-5 flex items-center gap-4">
            <div className="bg-gold-500/10 rounded-full p-2">
              <Trophy className="h-5 w-5 text-gold-400" />
            </div>
            <div>
              <p className="text-foreground/50 text-xs uppercase tracking-widest">Total Scores</p>
              <p className="text-white font-heading font-bold text-2xl">
                {scoresLoading ? '—' : scores.length}
              </p>
            </div>
          </div>
          <div className="bg-navy-900 border border-gold-500/20 rounded-lg p-5 flex items-center gap-4">
            <div className="bg-gold-500/10 rounded-full p-2">
              <Users className="h-5 w-5 text-gold-400" />
            </div>
            <div>
              <p className="text-foreground/50 text-xs uppercase tracking-widest">Total Shooters</p>
              <p className="text-white font-heading font-bold text-2xl">
                {scoresLoading ? '—' : totalShooters}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Add Score + Manage Admins */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Add Score Form */}
            <div className="bg-navy-900 border border-gold-500/20 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Plus className="h-5 w-5 text-gold-400" />
                <h2 className="font-heading font-bold text-white text-lg uppercase tracking-wide">
                  Add Score
                </h2>
                {actorFetching && (
                  <span className="ml-auto flex items-center gap-1 text-xs text-foreground/40">
                    <Wifi className="h-3 w-3 animate-pulse" />
                    Connecting…
                  </span>
                )}
              </div>

              {/* Actor initializing banner */}
              {actorFetching && (
                <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded p-3 mb-4 text-xs text-gold-400">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  Connecting to the backend. The form will be ready shortly…
                </div>
              )}

              <form onSubmit={handleAddScore} className="space-y-4">
                <div>
                  <Label htmlFor="shooterName" className="text-foreground/70 text-xs uppercase tracking-wide">
                    Shooter Name
                  </Label>
                  <Input
                    id="shooterName"
                    value={form.shooterName}
                    onChange={(e) => setForm({ ...form, shooterName: e.target.value })}
                    placeholder="Enter shooter name"
                    disabled={isFormDisabled}
                    className="mt-1 bg-navy-950 border-gold-500/20 text-white placeholder:text-foreground/30 focus:border-gold-500/60 disabled:opacity-50"
                  />
                </div>
                <div>
                  <Label className="text-foreground/70 text-xs uppercase tracking-wide">Discipline</Label>
                  <Select
                    value={form.discipline}
                    onValueChange={(v) => setForm({ ...form, discipline: v as Discipline })}
                    disabled={isFormDisabled}
                  >
                    <SelectTrigger className="mt-1 bg-navy-950 border-gold-500/20 text-white focus:border-gold-500/60 disabled:opacity-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-900 border-gold-500/20">
                      <SelectItem value={Discipline.Rifle} className="text-white hover:bg-gold-500/10">Rifle</SelectItem>
                      <SelectItem value={Discipline.Pistol} className="text-white hover:bg-gold-500/10">Pistol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="distance" className="text-foreground/70 text-xs uppercase tracking-wide">
                    Distance (m)
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    min="1"
                    value={form.distance}
                    onChange={(e) => setForm({ ...form, distance: e.target.value })}
                    placeholder="e.g. 10"
                    disabled={isFormDisabled}
                    className="mt-1 bg-navy-950 border-gold-500/20 text-white placeholder:text-foreground/30 focus:border-gold-500/60 disabled:opacity-50"
                  />
                </div>
                <div>
                  <Label htmlFor="scoreValue" className="text-foreground/70 text-xs uppercase tracking-wide">
                    Score
                  </Label>
                  <Input
                    id="scoreValue"
                    type="number"
                    min="0"
                    value={form.scoreValue}
                    onChange={(e) => setForm({ ...form, scoreValue: e.target.value })}
                    placeholder="e.g. 580"
                    disabled={isFormDisabled}
                    className="mt-1 bg-navy-950 border-gold-500/20 text-white placeholder:text-foreground/30 focus:border-gold-500/60 disabled:opacity-50"
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="text-foreground/70 text-xs uppercase tracking-wide">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    disabled={isFormDisabled}
                    className="mt-1 bg-navy-950 border-gold-500/20 text-white focus:border-gold-500/60 disabled:opacity-50"
                  />
                </div>

                {formError && (
                  <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded p-3 text-xs text-destructive">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    {formError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isFormDisabled}
                  className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold tracking-wide gap-2 disabled:opacity-60"
                >
                  {actorFetching ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Connecting…</>
                  ) : addScore.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Adding…</>
                  ) : (
                    <><Plus className="h-4 w-4" />Add Score</>
                  )}
                </Button>
              </form>
            </div>

            {/* Manage Admins — visible only to owner/admin role */}
            {isOwner && (
              <div className="bg-navy-900 border border-gold-500/30 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-5 w-5 text-gold-400" />
                  <h2 className="font-heading font-bold text-white text-lg uppercase tracking-wide">
                    Manage Admins
                  </h2>
                </div>
                <p className="text-foreground/50 text-xs mb-5 leading-relaxed">
                  Grant admin privileges to another user by entering their principal ID below.
                  The user must log in with their Internet Identity to find their principal ID.
                </p>

                {/* Info note */}
                <div className="flex items-start gap-2 bg-gold-500/8 border border-gold-500/20 rounded p-3 mb-5 text-xs text-gold-400/80">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-gold-400" />
                  <span>
                    <strong className="text-gold-400">Note:</strong> This system uses Internet Identity — not email addresses.
                    Ask the user to share their principal ID (shown after login). Email addresses cannot be used here.
                  </span>
                </div>

                <form onSubmit={handleGrantAdmin} className="space-y-4">
                  <div>
                    <Label htmlFor="adminPrincipal" className="text-foreground/70 text-xs uppercase tracking-wide">
                      Principal ID
                    </Label>
                    <Input
                      id="adminPrincipal"
                      value={adminPrincipal}
                      onChange={(e) => {
                        setAdminPrincipal(e.target.value);
                        setAdminGrantSuccess('');
                        setAdminGrantError('');
                      }}
                      placeholder="e.g. aaaaa-aa or xxxxx-xxxxx-xxxxx-xxxxx-cai"
                      disabled={grantAdminRole.isPending || actorFetching}
                      className="mt-1 bg-navy-950 border-gold-500/20 text-white placeholder:text-foreground/30 focus:border-gold-500/60 disabled:opacity-50 font-mono text-xs"
                    />
                  </div>

                  {adminGrantSuccess && (
                    <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded p-3 text-xs text-green-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      {adminGrantSuccess}
                    </div>
                  )}

                  {adminGrantError && (
                    <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded p-3 text-xs text-destructive">
                      <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                      {adminGrantError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={!adminPrincipal.trim() || grantAdminRole.isPending || actorFetching}
                    className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold tracking-wide gap-2 disabled:opacity-60"
                  >
                    {grantAdminRole.isPending ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Granting…</>
                    ) : (
                      <><ShieldCheck className="h-4 w-4" />Grant Admin Role</>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Scores Table */}
          <div className="lg:col-span-2">
            <div className="bg-navy-900 border border-gold-500/20 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 p-5 border-b border-gold-500/10">
                <Target className="h-5 w-5 text-gold-400" />
                <h2 className="font-heading font-bold text-white text-lg uppercase tracking-wide">
                  Manage Scores
                </h2>
              </div>

              {scoresLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full bg-navy-800" />
                  ))}
                </div>
              ) : scores.length === 0 ? (
                <div className="p-12 text-center text-foreground/40">
                  <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-heading font-bold uppercase tracking-wide mb-1">No Scores Yet</p>
                  <p className="text-sm">Add the first score using the form.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold-500/20 hover:bg-transparent">
                        <TableHead className="text-gold-400/80 uppercase tracking-widest text-xs">Shooter</TableHead>
                        <TableHead className="text-gold-400/80 uppercase tracking-widest text-xs">Discipline</TableHead>
                        <TableHead className="text-gold-400/80 uppercase tracking-widest text-xs">Dist.</TableHead>
                        <TableHead className="text-gold-400/80 uppercase tracking-widest text-xs">Score</TableHead>
                        <TableHead className="text-gold-400/80 uppercase tracking-widest text-xs">Date</TableHead>
                        <TableHead className="text-gold-400/80 uppercase tracking-widest text-xs text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scores.map((score, idx) => {
                        const scoreId = `score_${idx}_${score.shooterName}_${score.date}`;
                        return (
                          <TableRow key={scoreId} className="border-gold-500/10 hover:bg-gold-500/5">
                            <TableCell className="font-medium text-white text-sm">{score.shooterName}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  score.discipline === Discipline.Rifle
                                    ? 'border-gold-500/40 text-gold-400 text-xs'
                                    : 'border-blue-400/40 text-blue-400 text-xs'
                                }
                              >
                                {score.discipline === Discipline.Rifle ? 'Rifle' : 'Pistol'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-foreground/70 text-sm">{score.distance.toString()}m</TableCell>
                            <TableCell className="text-white font-bold text-sm">{score.scoreValue.toString()}</TableCell>
                            <TableCell className="text-foreground/60 text-sm">{score.date}</TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-foreground/40 hover:text-destructive hover:bg-destructive/10"
                                    disabled={deleteScore.isPending}
                                  >
                                    {deleteScore.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-navy-900 border-gold-500/20 text-white">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="font-heading text-white uppercase tracking-wide">
                                      Delete Score?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-foreground/60">
                                      This will permanently delete the score for{' '}
                                      <span className="text-gold-400 font-medium">{score.shooterName}</span>.
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-navy-950 border-gold-500/20 text-foreground/70 hover:bg-navy-800">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteScore(scoreId)}
                                      className="bg-destructive hover:bg-destructive/80 text-white"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
