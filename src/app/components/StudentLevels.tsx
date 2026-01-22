import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { PageHeader } from "./ui/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";

interface StudentLevel {
  id: number;
  name: string;
  code: string;
  studentCount: number;
}

export function StudentLevels() {
  const [levels, setLevels] = useState<StudentLevel[]>([
    { id: 1, name: "Grade 12", code: "G12", studentCount: 45 },
    { id: 2, name: "Grade 11", code: "G11", studentCount: 52 },
    { id: 3, name: "Grade 10", code: "G10", studentCount: 48 },
    { id: 4, name: "Grade 9", code: "G9", studentCount: 41 },
  ]);

  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelCode, setNewLevelCode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddLevel = () => {
    if (newLevelName.trim() && newLevelCode.trim()) {
      const newLevel: StudentLevel = {
        id: Math.max(...levels.map(l => l.id), 0) + 1,
        name: newLevelName.trim(),
        code: newLevelCode.trim().toUpperCase(),
        studentCount: 0,
      };
      setLevels([...levels, newLevel]);
      setNewLevelName("");
      setNewLevelCode("");
      setDialogOpen(false);
    }
  };

  const handleDeleteLevel = (id: number) => {
    setLevels(levels.filter(level => level.id !== id));
  };

  const LevelCard = ({ level }: { level: StudentLevel }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{level.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Code: {level.code}</p>
          </div>
          <Badge variant="outline">{level.studentCount} students</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteLevel(level.id)}
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Levels"
        subtitle="Manage academic levels and grades"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Level
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Student Level</DialogTitle>
                <DialogDescription>
                  Create a new grade level or academic year group.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="levelName">Level Name</Label>
                  <Input
                    id="levelName"
                    placeholder="e.g. Grade 10"
                    value={newLevelName}
                    onChange={(e) => setNewLevelName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="levelCode">Level Code</Label>
                  <Input
                    id="levelCode"
                    placeholder="e.g. G10"
                    value={newLevelCode}
                    onChange={(e) => setNewLevelCode(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleAddLevel}>
                  Add Level
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((level) => (
          <LevelCard key={level.id} level={level} />
        ))}
      </div>

      {levels.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <p>No student levels created yet. Start by adding one!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
