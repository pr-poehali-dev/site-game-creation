import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AIFriend {
  id: string;
  name: string;
  skinUrl: string;
  personality: string;
  level: number;
  mood: string;
  skills: string[];
  favoriteActivity: string;
}

const Index = () => {
  const [friends, setFriends] = useState<AIFriend[]>([
    {
      id: '1',
      name: 'Alex',
      skinUrl: '/placeholder.svg',
      personality: 'Смелый и дружелюбный',
      level: 15,
      mood: 'Счастлив',
      skills: ['Строительство', 'Сражения', 'Фарм'],
      favoriteActivity: 'Исследование пещер',
    },
    {
      id: '2',
      name: 'Steve',
      skinUrl: '/placeholder.svg',
      personality: 'Мудрый и терпеливый',
      level: 28,
      mood: 'Спокоен',
      skills: ['Редстоун', 'Майнинг', 'Торговля'],
      favoriteActivity: 'Создание механизмов',
    },
  ]);

  const [selectedFriend, setSelectedFriend] = useState<AIFriend | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ from: string; text: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newFriend, setNewFriend] = useState<Partial<AIFriend>>({
    name: '',
    skinUrl: '/placeholder.svg',
    personality: '',
    level: 1,
    mood: 'Нейтрален',
    skills: [],
    favoriteActivity: '',
  });

  const personalities = ['Смелый и дружелюбный', 'Мудрый и терпеливый', 'Весёлый и энергичный', 'Спокойный и тихий', 'Хитрый и умный'];
  const moods = ['Счастлив', 'Спокоен', 'Возбуждён', 'Грустит', 'Сосредоточен'];
  const availableSkills = ['Строительство', 'Сражения', 'Фарм', 'Редстоун', 'Майнинг', 'Торговля', 'Зачарование', 'Варка зелий'];
  const activities = ['Исследование пещер', 'Создание механизмов', 'Строительство домов', 'Охота на мобов', 'Сбор ресурсов', 'Торговля с жителями'];

  const handleCreateFriend = () => {
    if (!newFriend.name || !newFriend.personality) {
      toast.error('Заполните имя и характер друга');
      return;
    }

    const friend: AIFriend = {
      id: Date.now().toString(),
      name: newFriend.name,
      skinUrl: newFriend.skinUrl || '/placeholder.svg',
      personality: newFriend.personality,
      level: newFriend.level || 1,
      mood: newFriend.mood || 'Нейтрален',
      skills: newFriend.skills || [],
      favoriteActivity: newFriend.favoriteActivity || 'Исследование',
    };

    setFriends([...friends, friend]);
    setNewFriend({ name: '', skinUrl: '/placeholder.svg', personality: '', level: 1, mood: 'Нейтрален', skills: [], favoriteActivity: '' });
    setIsCreating(false);
    toast.success(`ИИ-друг "${friend.name}" создан! 🎮`);
  };

  const toggleSkill = (skill: string) => {
    const current = newFriend.skills || [];
    if (current.includes(skill)) {
      setNewFriend({ ...newFriend, skills: current.filter(s => s !== skill) });
    } else {
      setNewFriend({ ...newFriend, skills: [...current, skill] });
    }
  };

  const handleSkinUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewFriend({ ...newFriend, skinUrl: reader.result as string });
        toast.success('Скин загружен! 🎨');
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = () => {
    if (!chatMessage.trim() || !selectedFriend) return;

    setChatHistory([...chatHistory, { from: 'Ты', text: chatMessage }]);

    const responses = [
      `Привет! Я ${selectedFriend.name}, готов к приключениям! 🎮`,
      `Отличная идея! Моя специальность - ${selectedFriend.skills[0]}!`,
      `Я сейчас ${selectedFriend.mood.toLowerCase()}. Давай займёмся чем-то интересным!`,
      `Знаешь, больше всего люблю ${selectedFriend.favoriteActivity.toLowerCase()}!`,
      `Я уже ${selectedFriend.level} уровня! Вместе мы сильнее! 💪`,
    ];

    setTimeout(() => {
      setChatHistory(prev => [...prev, { from: selectedFriend.name, text: responses[Math.floor(Math.random() * responses.length)] }]);
    }, 800);

    setChatMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] p-4" style={{ fontFamily: '"Orbitron", sans-serif' }}>
      <div className="max-w-6xl mx-auto pb-20">
        <header className="mb-6 text-center">
          <h1 
            className="text-3xl md:text-5xl font-black mb-2 bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#a855f7] bg-clip-text text-transparent"
            style={{ textShadow: '0 0 20px rgba(0,255,136,0.5), 0 0 40px rgba(0,212,255,0.3)' }}
          >
            ИИ-ДРУЗЬЯ
          </h1>
          <p className="text-sm text-accent mb-4 tracking-widest uppercase">Minecraft Bedrock Edition</p>
          
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent text-black font-bold shadow-[0_0_20px_rgba(0,255,136,0.6)] hover:shadow-[0_0_30px_rgba(0,255,136,0.8)] transition-all"
              >
                <Icon name="UserPlus" size={20} className="mr-2" />
                Создать ИИ-друга
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto border-primary/30 bg-card">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-primary">Новый ИИ-друг</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <img 
                      src={newFriend.skinUrl} 
                      alt="Skin preview" 
                      className="w-32 h-32 rounded-lg border-2 border-primary/50 object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg pointer-events-none" />
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef}
                    onChange={handleSkinUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-accent/50 text-accent hover:bg-accent/10"
                  >
                    <Icon name="Upload" size={16} className="mr-2" />
                    Загрузить скин
                  </Button>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Имя друга</Label>
                  <Input
                    value={newFriend.name}
                    onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
                    placeholder="Введите имя"
                    className="bg-input border-primary/30"
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Характер</Label>
                  <Select value={newFriend.personality} onValueChange={(val) => setNewFriend({ ...newFriend, personality: val })}>
                    <SelectTrigger className="bg-input border-primary/30">
                      <SelectValue placeholder="Выберите характер" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalities.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Настроение</Label>
                  <Select value={newFriend.mood} onValueChange={(val) => setNewFriend({ ...newFriend, mood: val })}>
                    <SelectTrigger className="bg-input border-primary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Навыки (выберите до 3)</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map(skill => (
                      <Badge
                        key={skill}
                        variant={newFriend.skills?.includes(skill) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all ${
                          newFriend.skills?.includes(skill) 
                            ? 'bg-primary text-primary-foreground shadow-[0_0_10px_rgba(0,255,136,0.4)]' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Любимое занятие</Label>
                  <Select value={newFriend.favoriteActivity} onValueChange={(val) => setNewFriend({ ...newFriend, favoriteActivity: val })}>
                    <SelectTrigger className="bg-input border-primary/30">
                      <SelectValue placeholder="Выберите занятие" />
                    </SelectTrigger>
                    <SelectContent>
                      {activities.map(a => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Уровень</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={newFriend.level}
                    onChange={(e) => setNewFriend({ ...newFriend, level: parseInt(e.target.value) || 1 })}
                    className="bg-input border-primary/30"
                  />
                </div>

                <Button 
                  onClick={handleCreateFriend} 
                  className="w-full bg-gradient-to-r from-primary to-accent text-black font-bold"
                >
                  <Icon name="Check" size={16} className="mr-2" />
                  Создать друга
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {friends.map(friend => (
            <Card
              key={friend.id}
              className="p-4 bg-card border-2 border-primary/20 hover:border-primary/60 transition-all cursor-pointer hover:shadow-[0_0_25px_rgba(0,255,136,0.3)]"
              onClick={() => {
                setSelectedFriend(friend);
                setChatHistory([]);
              }}
            >
              <div className="flex gap-4">
                <div className="relative">
                  <img 
                    src={friend.skinUrl} 
                    alt={friend.name}
                    className="w-20 h-20 rounded-lg border-2 border-primary/50 object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                    {friend.level}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-primary">{friend.name}</h3>
                    <Badge variant="secondary" className="text-xs bg-secondary/20 text-secondary border-secondary/30">
                      {friend.mood}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{friend.personality}</p>
                  <div className="flex flex-wrap gap-1">
                    {friend.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs border-accent/30 text-accent">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Icon name="Heart" size={12} className="text-primary" />
                    {friend.favoriteActivity}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {selectedFriend && (
          <Card className="p-4 border-2 border-accent/30 bg-card shadow-[0_0_30px_rgba(0,212,255,0.2)]">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-accent/20">
              <img 
                src={selectedFriend.skinUrl} 
                alt={selectedFriend.name}
                className="w-12 h-12 rounded-lg border-2 border-accent/50"
                style={{ imageRendering: 'pixelated' }}
              />
              <div>
                <h3 className="font-bold text-accent text-lg">{selectedFriend.name}</h3>
                <p className="text-xs text-muted-foreground">Уровень {selectedFriend.level}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedFriend(null)}
                className="ml-auto"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="h-64 overflow-y-auto mb-4 space-y-2 px-2">
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <Icon name="MessageCircle" size={48} className="mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">Начните беседу с {selectedFriend.name}!</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.from === 'Ты' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.from === 'Ты' 
                          ? 'bg-primary/20 border border-primary/30 text-foreground' 
                          : 'bg-accent/20 border border-accent/30 text-foreground'
                      }`}
                    >
                      <p className="text-xs font-bold mb-1 opacity-70">{msg.from}</p>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Напиши сообщение..."
                className="bg-input border-accent/30"
              />
              <Button 
                onClick={sendMessage}
                className="bg-gradient-to-r from-accent to-secondary text-black font-bold"
              >
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </Card>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none" />
    </div>
  );
};

export default Index;
