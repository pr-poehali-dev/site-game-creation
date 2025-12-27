import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface NPC {
  id: string;
  name: string;
  profession: string;
  skin: string;
  personality: string;
  animations: string[];
  dialogue: string;
  world?: string;
}

const Index = () => {
  const [npcs, setNpcs] = useState<NPC[]>([
    {
      id: '1',
      name: 'Стив-торговец',
      profession: 'Торговец',
      skin: 'villager',
      personality: 'Дружелюбный',
      animations: ['wave', 'trade', 'happy'],
      dialogue: 'Приветствую! У меня лучшие товары!',
    },
    {
      id: '2',
      name: 'Алекс-страж',
      profession: 'Охранник',
      skin: 'knight',
      personality: 'Серьёзный',
      animations: ['guard', 'attack', 'alert'],
      dialogue: 'Стой! Кто идёт?',
    },
    {
      id: '3',
      name: 'Волшебник Мерлин',
      profession: 'Маг',
      skin: 'wizard',
      personality: 'Мудрый',
      animations: ['cast', 'float', 'study'],
      dialogue: 'Магия - это искусство...',
    },
  ]);

  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNpc, setNewNpc] = useState<Partial<NPC>>({
    name: '',
    profession: 'Торговец',
    skin: 'villager',
    personality: 'Дружелюбный',
    animations: [],
    dialogue: '',
  });

  const professions = ['Торговец', 'Охранник', 'Маг', 'Фермер', 'Кузнец', 'Строитель'];
  const skins = ['villager', 'knight', 'wizard', 'farmer', 'blacksmith', 'builder'];
  const personalities = ['Дружелюбный', 'Серьёзный', 'Мудрый', 'Весёлый', 'Грустный', 'Злой'];
  const availableAnimations = ['wave', 'trade', 'happy', 'guard', 'attack', 'alert', 'cast', 'float', 'study', 'work', 'dance', 'sleep'];

  const worlds = ['Основной мир', 'Пещеры', 'Деревня', 'Замок', 'Шахта'];

  const handleCreateNpc = () => {
    if (!newNpc.name || !newNpc.dialogue) {
      toast.error('Заполните имя и диалог НПС');
      return;
    }

    const npc: NPC = {
      id: Date.now().toString(),
      name: newNpc.name,
      profession: newNpc.profession || 'Торговец',
      skin: newNpc.skin || 'villager',
      personality: newNpc.personality || 'Дружелюбный',
      animations: newNpc.animations || [],
      dialogue: newNpc.dialogue || '',
    };

    setNpcs([...npcs, npc]);
    setNewNpc({ name: '', profession: 'Торговец', skin: 'villager', personality: 'Дружелюбный', animations: [], dialogue: '' });
    setIsCreating(false);
    toast.success(`НПС "${npc.name}" создан!`);
  };

  const toggleAnimation = (anim: string) => {
    const current = newNpc.animations || [];
    if (current.includes(anim)) {
      setNewNpc({ ...newNpc, animations: current.filter(a => a !== anim) });
    } else {
      setNewNpc({ ...newNpc, animations: [...current, anim] });
    }
  };

  const connectToWorld = (npcId: string, world: string) => {
    setNpcs(npcs.map(npc => npc.id === npcId ? { ...npc, world } : npc));
    toast.success(`НПС подключен к миру "${world}"`);
  };

  const getSkinEmoji = (skin: string) => {
    const map: Record<string, string> = {
      villager: '🧑‍🌾',
      knight: '⚔️',
      wizard: '🧙',
      farmer: '👨‍🌾',
      blacksmith: '🔨',
      builder: '👷',
    };
    return map[skin] || '🧑';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#90EE90] p-4 md:p-8" style={{ fontFamily: '"Press Start 2P", cursive' }}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-4xl mb-4 text-primary drop-shadow-lg" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}>
            🎮 NPC Мод Майнкрафт
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mb-6">Создавай и управляй персонажами</p>
          
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button size="lg" className="text-xs md:text-sm shadow-lg hover:scale-105 transition-transform" style={{ imageRendering: 'pixelated' }}>
                <Icon name="Plus" size={20} className="mr-2" />
                Создать НПС
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-sm md:text-base">Новый персонаж</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs">Имя НПС</Label>
                  <Input
                    value={newNpc.name}
                    onChange={(e) => setNewNpc({ ...newNpc, name: e.target.value })}
                    placeholder="Введите имя"
                    className="text-xs"
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Профессия</Label>
                  <Select value={newNpc.profession} onValueChange={(val) => setNewNpc({ ...newNpc, profession: val })}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map(p => (
                        <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Внешность</Label>
                  <Select value={newNpc.skin} onValueChange={(val) => setNewNpc({ ...newNpc, skin: val })}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {skins.map(s => (
                        <SelectItem key={s} value={s} className="text-xs">{getSkinEmoji(s)} {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Характер</Label>
                  <Select value={newNpc.personality} onValueChange={(val) => setNewNpc({ ...newNpc, personality: val })}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {personalities.map(p => (
                        <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Анимации и эмоции</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableAnimations.map(anim => (
                      <Badge
                        key={anim}
                        variant={newNpc.animations?.includes(anim) ? 'default' : 'outline'}
                        className="cursor-pointer text-xs hover:scale-105 transition-transform"
                        onClick={() => toggleAnimation(anim)}
                      >
                        {anim}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Диалог</Label>
                  <Textarea
                    value={newNpc.dialogue}
                    onChange={(e) => setNewNpc({ ...newNpc, dialogue: e.target.value })}
                    placeholder="Что говорит НПС?"
                    className="text-xs"
                    rows={3}
                  />
                </div>

                <Button onClick={handleCreateNpc} className="w-full text-xs">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить персонажа
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 text-xs">
            <TabsTrigger value="library">
              <Icon name="Library" size={16} className="mr-2" />
              Библиотека
            </TabsTrigger>
            <TabsTrigger value="worlds">
              <Icon name="Globe" size={16} className="mr-2" />
              Миры
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Icon name="Package" size={16} className="mr-2" />
              Шаблоны
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {npcs.map(npc => (
                <Card
                  key={npc.id}
                  className="p-4 border-4 border-muted shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
                  style={{ imageRendering: 'pixelated' }}
                  onClick={() => setSelectedNpc(npc)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{getSkinEmoji(npc.skin)}</div>
                    {npc.world && (
                      <Badge variant="secondary" className="text-xs">
                        <Icon name="MapPin" size={12} className="mr-1" />
                        {npc.world}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xs md:text-sm font-bold mb-2 truncate">{npc.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{npc.profession}</Badge>
                      <Badge variant="outline" className="text-xs">{npc.personality}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{npc.dialogue}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {npc.animations.slice(0, 3).map(anim => (
                        <Badge key={anim} className="text-xs">{anim}</Badge>
                      ))}
                      {npc.animations.length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{npc.animations.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedNpc && (
              <Dialog open={!!selectedNpc} onOpenChange={() => setSelectedNpc(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-base">
                      <span className="text-3xl">{getSkinEmoji(selectedNpc.skin)}</span>
                      {selectedNpc.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Профессия</Label>
                        <p className="text-sm">{selectedNpc.profession}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Характер</Label>
                        <p className="text-sm">{selectedNpc.personality}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Анимации</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedNpc.animations.map(anim => (
                          <Badge key={anim} className="text-xs">{anim}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Диалог</Label>
                      <p className="text-sm bg-muted p-3 rounded-md">{selectedNpc.dialogue}</p>
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">Подключить к миру</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {worlds.map(world => (
                          <Button
                            key={world}
                            variant={selectedNpc.world === world ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => connectToWorld(selectedNpc.id, world)}
                          >
                            <Icon name="MapPin" size={14} className="mr-1" />
                            {world}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          <TabsContent value="worlds" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {worlds.map(world => {
                const worldNpcs = npcs.filter(npc => npc.world === world);
                return (
                  <Card key={world} className="p-4 border-4 border-muted shadow-lg" style={{ imageRendering: 'pixelated' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="Globe" size={20} />
                      <h3 className="text-sm font-bold">{world}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      НПС в мире: {worldNpcs.length}
                    </p>
                    <div className="space-y-2">
                      {worldNpcs.map(npc => (
                        <div key={npc.id} className="flex items-center gap-2 text-xs p-2 bg-muted rounded">
                          <span>{getSkinEmoji(npc.skin)}</span>
                          <span className="truncate">{npc.name}</span>
                        </div>
                      ))}
                      {worldNpcs.length === 0 && (
                        <p className="text-xs text-muted-foreground italic">Нет персонажей</p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Дружелюбный торговец', profession: 'Торговец', skin: 'villager', desc: 'Готовый шаблон торговца с анимациями' },
                { name: 'Охранник ворот', profession: 'Охранник', skin: 'knight', desc: 'Настроенный охранник для вашей крепости' },
                { name: 'Деревенский фермер', profession: 'Фермер', skin: 'farmer', desc: 'Работник для фермы с диалогами' },
              ].map((template, idx) => (
                <Card key={idx} className="p-4 border-4 border-muted shadow-lg hover:shadow-xl transition-all cursor-pointer" style={{ imageRendering: 'pixelated' }}>
                  <div className="text-4xl mb-3">{getSkinEmoji(template.skin)}</div>
                  <h3 className="text-xs md:text-sm font-bold mb-2">{template.name}</h3>
                  <Badge variant="outline" className="mb-3 text-xs">{template.profession}</Badge>
                  <p className="text-xs text-muted-foreground mb-3">{template.desc}</p>
                  <Button size="sm" className="w-full text-xs" onClick={() => toast.success('Шаблон загружен!')}>
                    <Icon name="Download" size={14} className="mr-1" />
                    Использовать
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
