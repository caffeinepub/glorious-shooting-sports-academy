import { useState } from 'react';
import { Target, Trophy, TrendingUp, Users, ArrowUpDown, ArrowUp, ArrowDown, CalendarDays } from 'lucide-react';
import { useGetScores } from '../hooks/useQueries';
import { Discipline } from '../backend';
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

type SortField = 'shooterName' | 'scoreValue' | 'date' | 'discipline' | 'distance';
type SortDir = 'asc' | 'desc';

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function DisciplineBadge({ discipline }: { discipline: Discipline }) {
  return (
    <Badge
      variant="outline"
      className={
        discipline === Discipline.Rifle
          ? 'border-blue-500/50 text-blue-400 bg-blue-500/10'
          : 'border-green-500/50 text-green-400 bg-green-500/10'
      }
    >
      {discipline}
    </Badge>
  );
}

export default function ScoresPage() {
  const { data: scores = [], isLoading, isError } = useGetScores();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const today = getTodayString();
  const todayScores = scores.filter((s) => s.date === today);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sorted = [...scores].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'shooterName') cmp = a.shooterName.localeCompare(b.shooterName);
    else if (sortField === 'scoreValue') cmp = Number(a.scoreValue) - Number(b.scoreValue);
    else if (sortField === 'date') cmp = a.date.localeCompare(b.date);
    else if (sortField === 'discipline') cmp = a.discipline.localeCompare(b.discipline);
    else if (sortField === 'distance') cmp = Number(a.distance) - Number(b.distance);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalShooters = new Set(scores.map((s) => s.shooterName)).size;
  const topScore = scores.length > 0
    ? Math.max(...scores.map((s) => Number(s.scoreValue)))
    : 0;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === 'asc'
      ? <ArrowUp className="h-3 w-3 ml-1 text-gold-400" />
      : <ArrowDown className="h-3 w-3 ml-1 text-gold-400" />;
  };

  // Format today's date for display
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gold-500/10 border border-gold-500/30 rounded-full p-4">
              <Trophy className="h-8 w-8 text-gold-400" />
            </div>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3">
            Shooter <span className="text-gold-400">Scores</span>
          </h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Official scores for Glorious Shooting Sports Academy students — updated by academy administrators.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { icon: <Users className="h-5 w-5 text-gold-400" />, label: 'Total Shooters', value: isLoading ? '—' : totalShooters },
            { icon: <Target className="h-5 w-5 text-gold-400" />, label: 'Total Scores', value: isLoading ? '—' : scores.length },
            { icon: <TrendingUp className="h-5 w-5 text-gold-400" />, label: 'Top Score', value: isLoading ? '—' : topScore },
          ].map((stat) => (
            <div key={stat.label} className="bg-navy-900 border border-gold-500/20 rounded-lg p-5 flex items-center gap-4">
              <div className="bg-gold-500/10 rounded-full p-2">{stat.icon}</div>
              <div>
                <p className="text-foreground/50 text-xs uppercase tracking-widest">{stat.label}</p>
                <p className="text-white font-heading font-bold text-2xl">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Scores Section */}
        <div className="mb-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gold-500/15 border border-gold-500/40 rounded-lg p-2">
                <CalendarDays className="h-5 w-5 text-gold-400" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-white uppercase tracking-tight">
                  Today's <span className="text-gold-400">Scores</span>
                </h2>
                <p className="text-foreground/50 text-xs mt-0.5">{todayFormatted}</p>
              </div>
            </div>
            {!isLoading && todayScores.length > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                {todayScores.length} {todayScores.length === 1 ? 'Entry' : 'Entries'}
              </span>
            )}
          </div>

          <div className="bg-navy-900 border border-gold-500/30 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full bg-navy-800" />
                ))}
              </div>
            ) : todayScores.length === 0 ? (
              <div className="p-10 text-center">
                <CalendarDays className="h-9 w-9 mx-auto mb-3 text-gold-500/20" />
                <p className="font-heading font-bold text-base uppercase tracking-wide text-foreground/40 mb-1">
                  No Scores Recorded Today Yet
                </p>
                <p className="text-sm text-foreground/30">
                  Check back later — today's scores will appear here once added by the administrator.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold-500/20 hover:bg-transparent">
                      <TableHead className="text-gold-400/80 uppercase tracking-widest text-xs">Shooter</TableHead>
                      <TableHead className="text-gold-400/80 uppercase tracking-widest text-xs">Discipline</TableHead>
                      <TableHead className="text-gold-400/80 uppercase tracking-widest text-xs">Distance</TableHead>
                      <TableHead className="text-gold-400/80 uppercase tracking-widest text-xs">Score</TableHead>
                      <TableHead className="text-gold-400/80 uppercase tracking-widest text-xs">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayScores.map((score, idx) => (
                      <TableRow key={idx} className="border-gold-500/10 hover:bg-gold-500/5">
                        <TableCell className="font-medium text-white">{score.shooterName}</TableCell>
                        <TableCell>
                          <DisciplineBadge discipline={score.discipline} />
                        </TableCell>
                        <TableCell className="text-foreground/70">{Number(score.distance)}m</TableCell>
                        <TableCell>
                          <span className="font-heading font-bold text-gold-400 text-lg">
                            {Number(score.scoreValue)}
                          </span>
                        </TableCell>
                        <TableCell className="text-foreground/60 text-sm">{score.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gold-500/10" />
          <span className="text-foreground/30 text-xs uppercase tracking-widest font-bold">All Scores</span>
          <div className="flex-1 h-px bg-gold-500/10" />
        </div>

        {/* Full Scores Table */}
        <div className="bg-navy-900 border border-gold-500/20 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-navy-800" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-foreground/50">
              <Target className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Failed to load scores. Please try again later.</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="p-12 text-center text-foreground/50">
              <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-heading font-bold text-lg uppercase tracking-wide mb-1">No Scores Yet</p>
              <p className="text-sm">Scores will appear here once added by the academy administrator.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold-500/20 hover:bg-transparent">
                    <TableHead
                      className="text-gold-400/80 uppercase tracking-widest text-xs cursor-pointer hover:text-gold-400 select-none"
                      onClick={() => handleSort('shooterName')}
                    >
                      <span className="flex items-center">Shooter <SortIcon field="shooterName" /></span>
                    </TableHead>
                    <TableHead
                      className="text-gold-400/80 uppercase tracking-widest text-xs cursor-pointer hover:text-gold-400 select-none"
                      onClick={() => handleSort('discipline')}
                    >
                      <span className="flex items-center">Discipline <SortIcon field="discipline" /></span>
                    </TableHead>
                    <TableHead
                      className="text-gold-400/80 uppercase tracking-widest text-xs cursor-pointer hover:text-gold-400 select-none"
                      onClick={() => handleSort('distance')}
                    >
                      <span className="flex items-center">Distance <SortIcon field="distance" /></span>
                    </TableHead>
                    <TableHead
                      className="text-gold-400/80 uppercase tracking-widest text-xs cursor-pointer hover:text-gold-400 select-none"
                      onClick={() => handleSort('scoreValue')}
                    >
                      <span className="flex items-center">Score <SortIcon field="scoreValue" /></span>
                    </TableHead>
                    <TableHead
                      className="text-gold-400/80 uppercase tracking-widest text-xs cursor-pointer hover:text-gold-400 select-none"
                      onClick={() => handleSort('date')}
                    >
                      <span className="flex items-center">Date <SortIcon field="date" /></span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((score, idx) => (
                    <TableRow key={idx} className="border-gold-500/10 hover:bg-gold-500/5">
                      <TableCell className="font-medium text-white">{score.shooterName}</TableCell>
                      <TableCell>
                        <DisciplineBadge discipline={score.discipline} />
                      </TableCell>
                      <TableCell className="text-foreground/70">{Number(score.distance)}m</TableCell>
                      <TableCell>
                        <span className="font-heading font-bold text-gold-400 text-lg">
                          {Number(score.scoreValue)}
                        </span>
                      </TableCell>
                      <TableCell className="text-foreground/60 text-sm">{score.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
