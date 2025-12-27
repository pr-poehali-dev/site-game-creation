import { useState, useRef, useEffect } from 'react';
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
  xp: number;
  achievements: string[];
  messagesCount: number;
  xboxConnected?: boolean;
  xboxGamertag?: string;
  xboxXuid?: string;
}

const Index = () => {
  const [friends, setFriends] = useState<AIFriend[]>(() => {
    const saved = localStorage.getItem('mcAiFriends');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: '1',
        name: 'Alex',
        skinUrl: '/placeholder.svg',
        personality: 'Смелый и дружелюбный',
        level: 15,
        mood: 'Счастлив',
        skills: ['Строительство', 'Сражения', 'Фарм'],
        favoriteActivity: 'Исследование пещер',
        xp: 450,
        achievements: ['Первый друг', 'Строитель'],
        messagesCount: 0,
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
        xp: 840,
        achievements: ['Первый друг', 'Инженер', 'Мастер редстоуна'],
        messagesCount: 0,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('mcAiFriends', JSON.stringify(friends));
  }, [friends]);

  const [selectedFriend, setSelectedFriend] = useState<AIFriend | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ from: string; text: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConnectingXbox, setIsConnectingXbox] = useState(false);
  const [xboxAuthDialog, setXboxAuthDialog] = useState(false);
  const [connectingFriendId, setConnectingFriendId] = useState<string | null>(null);

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
      xp: 0,
      achievements: ['Первый друг'],
      messagesCount: 0,
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

  const addXP = (friendId: string, amount: number) => {
    setFriends(prevFriends => 
      prevFriends.map(f => {
        if (f.id !== friendId) return f;
        
        const newXP = f.xp + amount;
        const xpForNextLevel = f.level * 100;
        const newLevel = newXP >= xpForNextLevel ? f.level + 1 : f.level;
        const finalXP = newXP >= xpForNextLevel ? newXP - xpForNextLevel : newXP;
        
        const newAchievements = [...f.achievements];
        if (newLevel === 10 && !newAchievements.includes('Уровень 10')) {
          newAchievements.push('Уровень 10');
          toast.success(`${f.name} достиг 10 уровня! 🎉`);
        }
        if (newLevel === 25 && !newAchievements.includes('Уровень 25')) {
          newAchievements.push('Уровень 25');
          toast.success(`${f.name} достиг 25 уровня! 🏆`);
        }
        if (f.messagesCount + 1 === 10 && !newAchievements.includes('Болтун')) {
          newAchievements.push('Болтун');
          toast.success(`${f.name} получил достижение "Болтун"! 💬`);
        }
        if (f.messagesCount + 1 === 50 && !newAchievements.includes('Лучший друг')) {
          newAchievements.push('Лучший друг');
          toast.success(`${f.name} получил достижение "Лучший друг"! ❤️`);
        }
        
        if (newLevel > f.level) {
          toast.success(`${f.name} повысил уровень! Теперь ${newLevel} 🎊`);
        }
        
        return {
          ...f,
          xp: finalXP,
          level: newLevel,
          achievements: newAchievements,
          messagesCount: f.messagesCount + 1,
        };
      })
    );
  };

  const sendMessage = () => {
    if (!chatMessage.trim() || !selectedFriend) return;

    setChatHistory([...chatHistory, { from: 'Ты', text: chatMessage }]);

    const greetings = [
      `Привет! Я ${selectedFriend.name}, готов к приключениям! 🎮`,
      `Йо! Что будем делать сегодня? 😎`,
      `Эй, ${selectedFriend.name} на связи! 👋`,
    ];

    const skillResponses = [
      `Отличная идея! Моя специальность - ${selectedFriend.skills[0]}!`,
      `Знаешь, я крут в ${selectedFriend.skills[0]}! 💪`,
      `Могу помочь с ${selectedFriend.skills[0]}, это моё! 🔥`,
    ];

    const moodResponses = [
      `Я сейчас ${selectedFriend.mood.toLowerCase()}. Давай займёмся чем-то интересным!`,
      `Настроение - ${selectedFriend.mood.toLowerCase()}! Идём творить! ✨`,
      `Чувствую себя ${selectedFriend.mood.toLowerCase()}, но готов к делу! 💯`,
    ];

    const activityResponses = [
      `Знаешь, больше всего люблю ${selectedFriend.favoriteActivity.toLowerCase()}!`,
      `${selectedFriend.favoriteActivity} - моя стихия! 🌟`,
      `Предлагаю заняться ${selectedFriend.favoriteActivity.toLowerCase()}! 🎯`,
    ];

    const levelResponses = [
      `Я уже ${selectedFriend.level} уровня! Вместе мы сильнее! 💪`,
      `Уровень ${selectedFriend.level}! Скоро буду ещё круче! 🚀`,
      `${selectedFriend.level} lvl, чувствую силу! ⚡`,
    ];

    const funResponses = [
      'Слышал, что за горами нашли алмазы! 💎',
      'Эндермен опять украл мой блок... 😤',
      'Крипер чуть не взорвал мою базу вчера! 💥',
      'Давай построим что-то эпичное! 🏰',
      'Жители деревни предлагают крутую сделку! 🤝',
      'Энчант на удачу - лучший! ✨',
      'Нужно больше факелов, тут темно! 🔦',
    ];

    const allResponses = [...greetings, ...skillResponses, ...moodResponses, ...activityResponses, ...levelResponses, ...funResponses];

    setTimeout(() => {
      const response = allResponses[Math.floor(Math.random() * allResponses.length)];
      setChatHistory(prev => [...prev, { from: selectedFriend.name, text: response }]);
      addXP(selectedFriend.id, 15);
    }, 800);

    setChatMessage('');
  };

  const handleXboxConnect = async (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    setConnectingFriendId(friendId);
    setXboxAuthDialog(true);
  };

  const connectToXbox = async () => {
    if (!connectingFriendId) return;
    
    const friend = friends.find(f => f.id === connectingFriendId);
    if (!friend) return;

    setIsConnectingXbox(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/16474075-5563-4b6b-907a-6212f2cef5c2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect_friend',
          friend_id: friend.id,
          friend_name: friend.name,
          xbox_token: 'user_token'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setFriends(prevFriends => 
          prevFriends.map(f => 
            f.id === connectingFriendId 
              ? { ...f, xboxConnected: true, xboxGamertag: data.gamertag, xboxXuid: data.xuid }
              : f
          )
        );
        
        toast.success(`${friend.name} подключен к Xbox Live! 🎮`);
        
        setTimeout(async () => {
          const friendReq = await fetch('https://functions.poehali.dev/16474075-5563-4b6b-907a-6212f2cef5c2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'send_friend_request',
              gamertag: data.gamertag,
              player_xuid: 'player_xuid'
            })
          });
          
          const friendData = await friendReq.json();
          if (friendData.success) {
            toast.success(`Заявка в друзья отправлена! Прими её в Xbox App 📱`);
          }
        }, 1500);
        
        setXboxAuthDialog(false);
      }
    } catch (error) {
      toast.error('Ошибка подключения к Xbox Live');
    } finally {
      setIsConnectingXbox(false);
      setConnectingFriendId(null);
    }
  };

  const joinMinecraftGame = async (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (!friend || !friend.xboxConnected) {
      toast.error('Сначала подключи друга к Xbox Live!');
      return;
    }

    toast.loading(`${friend.name} присоединяется к игре...`);

    try {
      const response = await fetch('https://functions.poehali.dev/16474075-5563-4b6b-907a-6212f2cef5c2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join_game',
          gamertag: friend.xboxGamertag,
          session_id: 'current_session'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTimeout(() => {
          toast.success(`${friend.name} в игре! Смотри список игроков в Minecraft 🎮`);
        }, 3000);
      }
    } catch (error) {
      toast.error('Не удалось подключиться к игре');
    }
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
                  <div className="flex flex-wrap gap-1 mb-2">
                    {friend.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs border-accent/30 text-accent">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">XP</span>
                      <span className="text-accent font-bold">{friend.xp}/{friend.level * 100}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${(friend.xp / (friend.level * 100)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Heart" size={12} className="text-primary" />
                      {friend.favoriteActivity}
                    </p>
                    {friend.xboxConnected && (
                      <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                        <Icon name="Gamepad2" size={10} className="mr-1" />
                        Xbox
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-primary/10 flex gap-2" onClick={(e) => e.stopPropagation()}>
                {!friend.xboxConnected ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => handleXboxConnect(friend.id)}
                  >
                    <Icon name="Wifi" size={14} className="mr-1" />
                    Подключить к Xbox
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="flex-1 text-xs bg-gradient-to-r from-primary to-accent text-black font-bold"
                    onClick={() => joinMinecraftGame(friend.id)}
                  >
                    <Icon name="Play" size={14} className="mr-1" />
                    Присоединиться к игре
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={xboxAuthDialog} onOpenChange={setXboxAuthDialog}>
          <DialogContent className="max-w-md border-primary/30 bg-card">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
                <Icon name="Gamepad2" size={24} className="text-accent" />
                Подключение к Xbox Live
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-accent/20">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="Check" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground mb-1">Шаг 1: Авторизация</h4>
                    <p className="text-xs text-muted-foreground">Войди в свой аккаунт Microsoft/Xbox</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Icon name="UserPlus" size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground mb-1">Шаг 2: Добавить в друзья</h4>
                    <p className="text-xs text-muted-foreground">Заявка придёт в Xbox App на телефоне</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Icon name="Gamepad2" size={20} className="text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground mb-1">Шаг 3: Играй вместе!</h4>
                    <p className="text-xs text-muted-foreground">ИИ-друг сможет зайти в твой мир</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Info" size={16} className="text-accent" />
                  <p className="text-xs font-bold text-accent">Важно знать:</p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                  <li>Нужен аккаунт Microsoft/Xbox Live</li>
                  <li>Minecraft Bedrock Edition на устройстве</li>
                  <li>Интернет-соединение для игры</li>
                </ul>
              </div>

              <Button
                onClick={connectToXbox}
                disabled={isConnectingXbox}
                className="w-full bg-gradient-to-r from-primary to-accent text-black font-bold"
              >
                {isConnectingXbox ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Подключение...
                  </>
                ) : (
                  <>
                    <Icon name="Gamepad2" size={18} className="mr-2" />
                    Подключить к Xbox Live
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {selectedFriend && (
          <Card className="p-4 border-2 border-accent/30 bg-card shadow-[0_0_30px_rgba(0,212,255,0.2)]">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-accent/20">
              <img 
                src={selectedFriend.skinUrl} 
                alt={selectedFriend.name}
                className="w-12 h-12 rounded-lg border-2 border-accent/50"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-accent text-lg">{selectedFriend.name}</h3>
                  <Badge className="text-xs bg-accent/20 text-accent border-accent/30">
                    <Icon name="Star" size={12} className="mr-1" />
                    {selectedFriend.level} lvl
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Icon name="MessageCircle" size={12} className="text-primary" />
                    <span className="text-muted-foreground">{selectedFriend.messagesCount} сообщений</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Trophy" size={12} className="text-accent" />
                    <span className="text-muted-foreground">{selectedFriend.achievements.length} достижений</span>
                  </div>
                </div>
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

            <div className="mb-3 p-3 bg-muted/30 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-primary">Прогресс друга</p>
                <p className="text-xs text-accent">{selectedFriend.xp}/{selectedFriend.level * 100} XP</p>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500 shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                  style={{ width: `${(selectedFriend.xp / (selectedFriend.level * 100)) * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedFriend.achievements.map(achievement => (
                  <Badge key={achievement} variant="outline" className="text-xs border-accent/40 text-accent">
                    <Icon name="Award" size={10} className="mr-1" />
                    {achievement}
                  </Badge>
                ))}
              </div>
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