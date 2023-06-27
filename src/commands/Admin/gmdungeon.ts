import { Category } from "@discordx/utilities"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from "discord.js"
import { Client } from "discordx"
import { Discord, Slash, SlashChoice, SlashOption } from "@decorators"
import { Guard, UserPermissions } from "@guards"


const testDungeon = {
  "cell_bit": {
    "nothing": 0,
    "block": 1,
    "room": 2,
    "corridor": 4,
    "aperture": 32,
    "perimeter": 16,
    "room_id": 65472,
    "arch": 65536,
    "door": 131072,
    "locked": 262144,
    "trapped": 524288,
    "secret": 1048576,
    "portcullis": 2097152,
    "stair_down": 4194304,
    "stair_up": 8388608,
    "label": 4278190080,
  },
  "cells": [
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,   16,   16,   16,   16,   16,   16,   16,   16,   16,    0,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,   16,  386,  386,  386,  386,  386,  386,  386,65540,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,   16,  386,  386,  386,905970050,386,386,  386,   16,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,   16,  386,  386,  386,  386,  386,  386,  386,   16,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,   16,   16,   16,   16,   16,   16,   16,   16,   16,    0,    0,    0,   16,65540,   16,   16,   16,   16,   16,   16,   16,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,   16,  450,  450,  450,  450,  450,  450,  450,   16,    0,    0,    0,   16,  322,  322,  322,  322,  322,  322,  322,   16,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,   16,  450,  450,  450,922747330,450,450,  450,   16,    0,    0,    0,   16,  322,  322,  322,889192770,322,322,  322,   16,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,   16,  450,  450,  450,  450,  450,  450,  450,   16,    0,    0,    0,   16,  322,  322,  322,  322,  322,  322,  322,   16,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,   16,65540,   16,   16,   16,65540,   16,   16,   16,   16,   16,   16,   16,   16,   16,   16,   16,   16,   16,   16,   16,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,65540,   66,   66,   66,   66,   66,   66,   66,   16,   130,    130,    130,    130,    130,    130,    130,65540,    4,    4,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,   66,   66,   66,   66,   66,   66,   66,   16,   130,    130,    130,    130,    130,    130,    130,   16,    0,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,   66,   66,   66,   66,   66,   66,   66,65540,   130,    130,    130,    130,    130,    130,    130,65540,    4,    4,   1627389956,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,   66,   66,   66,    822083650, 66,   66,   66,    16,    130,    130,    130,    838860930,130,  130,  130,   16,    0,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,   66,   66,   66,   66,   66,   66,   66,   16,   130,    130,    130,    130,    130,    130,    130,   16,    0,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,   66,   66,   66,   66,   66,   66,   66,   16,   130,    130,    130,    130,    130,    130,    130,   16,    0,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,   66,   66,   66,   66,   66,   66,   66,   16,   130,    130,    130,    130,    130,    130,    130,65540,    4,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,65540,   16,   16,   16,   16,   16,   16,   16,    16,     16,     16,     16,  65540,     16,     16,   16,    4,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,    194,    194,    194,    194,    194,    194,    194,   16,    258,    258,    258,    258,    258,    258,    258,65540,    4,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,    194,    194,    194,    194,    194,    194,    194,   16,    258,    258,    258,    258,    258,    258,    258,   16,    0,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,    194,    194,    194,    194,    194,    194,    194,   16,    258,    258,    258,    258,    258,    258,    258,   16,    0,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,    194,    194,    194,    855638210,    194,    194,    194,   16,    258,    258,    258,    872415490,    258,    258,    258,   16,    0,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,65540,    194,    194,    194,    194,    194,    194,    194,65540,    258,    258,    258,    258,    258,    258,    258,   16,    0,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,    194,    194,    194,    194,    194,    194,    194,   16,    258,    258,    258,    258,    258,    258,    258,   16,    0,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    4,   16,    194,    194,    194,    194,    194,    194,    194,   16,    258,    258,    258,    258,    258,    258,    258,   16,    0,    0,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,   16,65540,   16,65540,   16,   16,   16,   16,   16,   16,   16,   16,   16,   16,   16,65540,   16,   16,   16,   16,   16,    4,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,   16,    578,    578,    578,    578,    578,65540,    4,    0,    0,    0,    0,    0,    0,   16,    514,    514,    514,    514,    514,65540,    4,    4,    4,    4,    4,    0],
    [0,    0,    0,    0,   16,    578,    578,    956301890,    578,    578,   16,    4,    0,    0,    0,    0,    0,    0,   16,    514,    514,    939524610,    514,    514,   16,    0,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,   16,    578,    578,    578,    578,    578,65540,    4,    0,    0,    0,    0,    0,    0,   16,    514,    514,    514,    514,    514,   16,    0,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,   16,   16,   16,   16,   16,   16,   16,    0,    0,    0,    0,    0,    0,    0,   16,   16,   16,   16,   16,   16,   16,    0,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0
    ]
  ],
  "corridor_features": {
    "a": {
      "detail": "Symbol of Hypnosis: DC 15 to find, DC 15 to disable;\n    affects all targets within 10 ft., DC 11 save or become incapacitated for 1d4 rounds",
      "key": "a",
      "marks": [
        {
          "col": 25,
          "row": 15
        }
      ],
      "summary": "Symbol of Hypnosis"
    }
  },
  "details": {
    "floor": "Uneven Flagstone (DC 10 to charge or run)",
    "history": "The dungeon was created by yuan-ti as a lair. It was eventually conquered by invaders, and has been conquered and altered many times since then.",
    "illumination": "Bright (lamps or torches every 40 ft.)",
    "special": null,
    "temperature": "Warm",
    "walls": "Natural Stone (DC 10 to climb)"
  },
  "egress": [
    {
      "col": 21,
      "depth": 0,
      "dir": "east",
      "row": 25,
      "type": "corridor"
    }
  ],
  "rooms": [
    null,
    {
      "area": 4900,
      "col": 3,
      "contents": {
        "summary": "Empty"
      },
      "doors": {
        "east": [
          {
            "col": 10,
            "desc": "Archway",
            "out_id": 2,
            "row": 11,
            "type": "arch"
          }
        ],
        "north": [
          {
            "col": 5,
            "desc": "Archway",
            "out_id": 7,
            "row": 8,
            "type": "arch"
          }
        ],
        "south": [
          {
            "col": 3,
            "desc": "Archway",
            "out_id": 3,
            "row": 16,
            "type": "arch"
          }
        ],
        "west": [
          {
            "col": 2,
            "desc": "Archway",
            "row": 9,
            "type": "arch"
          }
        ]
      },
      "east": 9,
      "height": 70,
      "id": 1,
      "north": 9,
      "row": 9,
      "shape": "square",
      "size": "",
      "south": 15,
      "west": 3,
      "width": 70
    },
    {
      "area": 4900,
      "col": 11,
      "contents": {
        "summary": "Empty"
      },
      "doors": {
        "east": [
          {
            "col": 18,
            "desc": "Archway",
            "row": 15,
            "type": "arch"
          },
          {
            "col": 18,
            "desc": "Archway",
            "row": 11,
            "type": "arch"
          },
          {
            "col": 18,
            "desc": "Archway",
            "row": 9,
            "type": "arch"
          }
        ],
        "south": [
          {
            "col": 15,
            "desc": "Archway",
            "out_id": 4,
            "row": 16,
            "type": "arch"
          }
        ],
        "west": [
          {
            "col": 10,
            "desc": "Archway",
            "out_id": 1,
            "row": 11,
            "type": "arch"
          }
        ]
      },
      "east": 17,
      "height": 70,
      "id": 2,
      "north": 9,
      "row": 9,
      "shape": "square",
      "size": "",
      "south": 15,
      "west": 11,
      "width": 70
    },
    {
      "area": 4900,
      "col": 3,
      "contents": {
        "summary": "Empty"
      },
      "doors": {
        "east": [
          {
            "col": 10,
            "desc": "Archway",
            "out_id": 4,
            "row": 21,
            "type": "arch"
          }
        ],
        "north": [
          {
            "col": 3,
            "desc": "Archway",
            "out_id": 1,
            "row": 16,
            "type": "arch"
          }
        ],
        "south": [
          {
            "col": 3,
            "desc": "Archway",
            "out_id": 9,
            "row": 24,
            "type": "arch"
          }
        ],
        "west": [
          {
            "col": 2,
            "desc": "Archway",
            "row": 21,
            "type": "arch"
          }
        ]
      },
      "east": 9,
      "height": 70,
      "id": 3,
      "north": 17,
      "row": 17,
      "shape": "square",
      "size": "",
      "south": 23,
      "west": 3,
      "width": 70
    },
    {
      "area": 4900,
      "col": 11,
      "contents": {
        "detail": {
          "hidden_treasure": [
            "Trapped and Locked Iron Chest (DC 25 to unlock, DC 30 to break; 60 hp)",
            "Fire Spray: DC 10 to find, DC 15 to disable;\n    affects all targets within a 20 ft. cone, DC 11 save or take 1d10 fire damage",
            "--",
            "2200 cp, 800 sp, 40 gp, banded agate (10 gp), blue quartz (10 gp), eye agate (10 gp), hematite (10 gp), 2 x moss agate (10 gp), 2 x rhodochrosite (10 gp), tiger eye (10 gp), Spell Scroll (Minor Illusion) (common, dmg 200), Spell Scroll (Tasha's Hideous Laughter) (common, dmg 200), 2 x Potion of Healing (common, dmg 187)"
          ],
          "room_features": "The ceiling is covered with scorch marks, and several pieces of torn paper are scattered throughout the room",
          "trap": [
            "Net Trap: DC 15 to find, DC 10 to disable;\n    affects all targets within a 10 ft. square area, DC 11 save or become restrained"
          ]
        },
        "summary": "Net Trap, Hidden Treasure"
      },
      "doors": {
        "east": [
          {
            "col": 18,
            "desc": "Archway",
            "row": 17,
            "type": "arch"
          }
        ],
        "north": [
          {
            "col": 15,
            "desc": "Archway",
            "out_id": 2,
            "row": 16,
            "type": "arch"
          }
        ],
        "south": [
          {
            "col": 15,
            "desc": "Archway",
            "out_id": 8,
            "row": 24,
            "type": "arch"
          }
        ],
        "west": [
          {
            "col": 10,
            "desc": "Archway",
            "out_id": 3,
            "row": 21,
            "type": "arch"
          }
        ]
      },
      "east": 17,
      "height": 70,
      "id": 4,
      "north": 17,
      "row": 17,
      "shape": "square",
      "size": "",
      "south": 23,
      "west": 11,
      "width": 70
    },
    {
      "area": 2100,
      "col": 13,
      "contents": {
        "detail": {
          "monster": [
            "Bugbear (cr 1, mm 33) and 1 x Goblin (cr 1/4, mm 166); medium, 250 xp",
            "--",
            "Treasure: 6 gp; 17 cp"
          ]
        },
        "inhabited": "Bugbear and 1 x Goblin",
        "summary": "Bugbear and 1 x Goblin"
      },
      "doors": {
        "north": [
          {
            "col": 13,
            "desc": "Archway",
            "out_id": 6,
            "row": 4,
            "type": "arch"
          }
        ]
      },
      "east": 19,
      "height": 30,
      "id": 5,
      "north": 5,
      "row": 5,
      "shape": "square",
      "size": "medium",
      "south": 7,
      "west": 13,
      "width": 70
    },
    {
      "area": 2100,
      "col": 13,
      "contents": {
        "detail": {
          "monster": [
            "Goblin Boss (cr 1, mm 166) and 1 x Goblin (cr 1/4, mm 166); medium, 250 xp",
            "--",
            "Treasure: 9 sp; 11 sp"
          ]
        },
        "inhabited": "Goblin Boss and 1 x Goblin",
        "summary": "Goblin Boss and 1 x Goblin"
      },
      "doors": {
        "east": [
          {
            "col": 20,
            "desc": "Archway",
            "row": 1,
            "type": "arch"
          }
        ],
        "south": [
          {
            "col": 13,
            "desc": "Archway",
            "out_id": 5,
            "row": 4,
            "type": "arch"
          }
        ]
      },
      "east": 19,
      "height": 30,
      "id": 6,
      "north": 1,
      "row": 1,
      "shape": "square",
      "size": "medium",
      "south": 3,
      "west": 13,
      "width": 70
    },
    {
      "area": 2100,
      "col": 1,
      "contents": {
        "detail": {
          "room_features": "Burning torches in iron sconces line the north and south walls, and mysterious levers and mechanisms cover the north and west walls"
        },
        "summary": "Empty"
      },
      "doors": {
        "south": [
          {
            "col": 5,
            "desc": "Archway",
            "out_id": 1,
            "row": 8,
            "type": "arch"
          },
          {
            "col": 1,
            "desc": "Archway",
            "row": 8,
            "type": "arch"
          }
        ]
      },
      "east": 7,
      "height": 30,
      "id": 7,
      "north": 5,
      "row": 5,
      "shape": "square",
      "size": "medium",
      "south": 7,
      "west": 1,
      "width": 70
    },
    {
      "area": 1500,
      "col": 15,
      "contents": {
        "detail": {
          "monster": [
            "Silver Dragon Wyrmling (cr 2, mm 118); deadly, 450 xp",
            "--",
            "Treasure: 2100 cp, 1700 sp, 50 gp, azurite (10 gp), banded agate (10 gp), rhodochrosite (10 gp), Philter of Love (uncommon, dmg 184), Potion of Greater Healing (uncommon, dmg 187)"
          ]
        },
        "inhabited": "Silver Dragon Wyrmling",
        "summary": "Silver Dragon Wyrmling"
      },
      "doors": {
        "east": [
          {
            "col": 20,
            "desc": "Archway",
            "row": 25,
            "type": "arch"
          }
        ],
        "north": [
          {
            "col": 15,
            "desc": "Archway",
            "out_id": 4,
            "row": 24,
            "type": "arch"
          }
        ]
      },
      "east": 19,
      "height": 30,
      "id": 8,
      "north": 25,
      "row": 25,
      "shape": "square",
      "size": "medium",
      "south": 27,
      "west": 15,
      "width": 50
    },
    {
      "area": 1500,
      "col": 1,
      "contents": {
        "detail": {
          "monster": [
            "Bugbear (cr 1, mm 33); medium, 200 xp",
            "--",
            "Treasure: 18 cp"
          ]
        },
        "inhabited": "Bugbear",
        "summary": "Bugbear"
      },
      "doors": {
        "east": [
          {
            "col": 6,
            "desc": "Archway",
            "row": 25,
            "type": "arch"
          },
          {
            "col": 6,
            "desc": "Archway",
            "row": 27,
            "type": "arch"
          }
        ],
        "north": [
          {
            "col": 3,
            "desc": "Archway",
            "out_id": 3,
            "row": 24,
            "type": "arch"
          },
          {
            "col": 1,
            "desc": "Archway",
            "row": 24,
            "type": "arch"
          }
        ]
      },
      "east": 5,
      "height": 30,
      "id": 9,
      "north": 25,
      "row": 25,
      "shape": "square",
      "size": "medium",
      "south": 27,
      "west": 1,
      "width": 50
    }
  ],
  "settings": {
    "add_stairs": "",
    "bleed": 4,
    "cell_size": 18,
    "corridor_layout": "Straight",
    "door_set": "None",
    "dungeon_layout": "Rectangle",
    "dungeon_size": "Fine",
    "grid": "Square",
    "image_size": "",
    "infest": "dnd_5e",
    "last_room_id": 9,
    "level": 1,
    "map_cols": "51",
    "map_rows": "65",
    "map_style": "Standard",
    "max_col": 22,
    "max_row": 28,
    "motif": "",
    "n_cols": 23,
    "n_i": 14,
    "n_j": 11,
    "n_pc": 4,
    "n_rooms": 9,
    "n_rows": 29,
    "name": "The Secret Caverns of Horror",
    "peripheral_egress": "Yes",
    "remove_arcs": "All",
    "remove_deadends": "All",
    "room_layout": "Scattered",
    "room_polymorph": "",
    "room_size": "Medium",
    "seed": 910156620
  },
  "wandering_monsters": {
    "1": "Ogre Zombie (cr 2, mm 316); deadly, 450 xp, wielding bizarre eldritch powers",
    "2": "Silver Dragon Wyrmling (cr 2, mm 118); deadly, 450 xp, scavenging for food and treasure",
    "3": "2 x Goblin (cr 1/4, mm 166); easy, 100 xp, gathered around an evil shrine",
    "4": "Orog (cr 2, mm 247); deadly, 450 xp, wielding bizarre eldritch powers",
    "5": "Goblin (cr 1/4, mm 166) and 1 x Wolf (cr 1/4, mm 341); easy, 100 xp, returning to their lair with plunder",
    "6": "Bugbear (cr 1, mm 33); medium, 200 xp, bloodied and fleeing a more powerful enemy"
  }
};

function getBlock(cellValue: number) {
	if (!cellValue) {
		return `🟪`;
	}
	if (cellValue % (testDungeon?.cell_bit['block'] * 2)) { //
		return `🟪`;
	}
	else if (cellValue % (testDungeon?.cell_bit['room'] * 2)) { //
		return `⬛`;
	}
	else if (cellValue % (testDungeon?.cell_bit['corridor'] * 2)) { //
		return `⬛`;
	}
	else if (cellValue % (testDungeon?.cell_bit['aperture'] * 2)) { //
		return `🟪`;
	}
	else if (cellValue % (testDungeon?.cell_bit['perimeter'] * 2)) { //
		return `🟪`;
	}
	else if (cellValue % (testDungeon?.cell_bit['room_id'] * 2)) { //
		// return `☑️`;
		return `⬛`;
	}
	else if (cellValue % (testDungeon?.cell_bit['arch'] * 2)) { //
		return `🚪`;
	}
	else if (cellValue % (testDungeon?.cell_bit['door'] * 2)) { //
		if (cellValue %( testDungeon?.cell_bit['secret'] * 2)) { //
			return `🟪`;
		}
		// cellValue % testDungeon?.cell_bit['trapped'] * 2; //
		// if (cellValue % testDungeon?.cell_bit['locked'] * 2) { //
		// 	return `⚿`;
		// }
		return `🚪`;
	}
	else if (cellValue % (testDungeon?.cell_bit['portcullis'] * 2)) { //
		return `🚪`;
	}
	// cellValue % testDungeon?.cell_bit['stair_down'] * 2; //
	// cellValue % testDungeon?.cell_bit['stair_up'] * 2; //
	// cellValue % testDungeon?.cell_bit['label'] * 2; //
	return `🟪`;
}

@Discord()
@Category('Admin')
export default class GmDungeonCommand {

	@Slash({ 
		name: 'gmdungeon',
		description: 'TEST'
	})
	@Guard(
		UserPermissions(['Administrator'])
	)
	async gmdungeon(
		// @SlashOption({ name: 'url', type: ApplicationCommandOptionType.String, required: true }) url: string,
		// @SlashOption({ name: 'weeks', type: ApplicationCommandOptionType.Number, required: false }) weeks: number,
		// @SlashOption({ name: 'months', type: ApplicationCommandOptionType.Number, required: false }) months: number,
		// @SlashOption({ name: 'number', type: ApplicationCommandOptionType.Number, required: false }) number: number,
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		await interaction.deferReply();

		const {
			cell_bit, cells, corridor_features, details, egress, rooms, settings, wandering_monsters
		} = testDungeon;
		const statusBar = `\`💗${10}/${10} | 🛡️${10}\``;

		const xBuffer = 4;
		const yBuffer = 4;
		// const xBufferEnd = testDungeon?.cells?.[0]?.length - xBuffer;
		// const yBufferEnd = testDungeon?.cells?.[0]?.length - yBuffer;
		const viewDistance = 6;
		const position = {
			x: testDungeon?.egress[0]?.col + xBuffer, // 21 + 5
			y: testDungeon?.egress[0]?.row + yBuffer, // 25 + 4
		}
		const dungeonView: [string] = [``];
		for (let y = -viewDistance; y <= viewDistance; y++) {
			const dvIndex = y + viewDistance;
			dungeonView[dvIndex] = ``;
			for (let x = -viewDistance; x <= viewDistance; x++) {
				const cellData = testDungeon?.cells?.[y+position?.y]?.[x+position?.x] ?? 0;
				if (x == 0 && y == 0) {
					dungeonView[dvIndex] += `🧝🏽`;//`🧑`; //`()`;
				} else 
				if (x == 1 && y == 0) {
					dungeonView[dvIndex] += `🚪`;//`🧑`; //`()`;
				} else 
				dungeonView[dvIndex] += getBlock(cellData);
			}
			dungeonView[dvIndex] += `\` ${dvIndex + 1}\``;
		}
		dungeonView.push(`\`A  B  C  D  E  F  G  H  I  J  K  L  M  🗙\``);

		const playerView = [statusBar, ...dungeonView];

		console.log(playerView.join('\n'));
		// const playerView = dungeonView.map((v, i) => {
		// 	return v + statusBar[i]
		// })

		// const dungeonView = ['']
		// for (let y = 0; y <= (testDungeon?.cells?.length - 1); y++) {
		// 	dungeonView[y] = ``;
		// 	for (let x = 0; x <= (testDungeon?.cells?.[y]?.length - 1); x++) {
		// 		if (x-xBuffer == position?.x && y-yBuffer == position?.y) {
		// 			dungeonView[y] += `()`;
		// 		} else {
		// 			const cellValue = testDungeon?.cells?.[y]?.[x] ?? 0;
		// 			dungeonView[y] += getBlock(cellValue);
		// 			console.log('-> ' + x + ',' + y)
		// 		}
		// 	}
		// }


		const embeds = [
			// Map Settings
			// "peripheral_egress": <- egress is start location, for now
			// { 
			// 	title: `${settings?.name}`,
			// 	// description: `\n\`\`\`${JSON.stringify(testDungeon, null, 2)}\`\`\``,
			// 	description: ``
			// 	// + `*Level*: ${settings?.level}\n`
			// 	// + `*Temperature*: ${details?.temperature}\n`
			// 	// + `*Illumination*: ${details?.illumination}\n`
			// 	// + `*Floor*: ${details?.floor}\n`
			// 	// + `*Walls*: ${details?.walls}\n`
			// 	// + (details?.special ? `*special*: ${details?.special}\n` : '')
			// 	+ `${details?.history}\n`,
			// },
			// { 
			// 	title: `Map Legend`,
			// 	// description: `\n\`\`\`${JSON.stringify(testDungeon, null, 2)}\`\`\``,
			// 	description: `\n\`\`\`${testDungeon?.cell_bit}\`\`\``
			// },
			{ 
				description: `\`\`\`${playerView.join('\n')}\`\`\``
				// description: `${playerView.join('\n')}`,
			},
		];

		const components = [
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder().setCustomId(`move_up_left`).setLabel("↖️").setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId(`move_up`).setLabel("⬆️").setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId(`move_up_right`).setLabel("↗️").setStyle(ButtonStyle.Primary),
				// new ButtonBuilder().setCustomId(`action_l`).setLabel("L").setStyle(ButtonStyle.Secondary),
				// new ButtonBuilder().setCustomId(`action_r`).setLabel("R").setStyle(ButtonStyle.Secondary),
			),
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder().setCustomId(`move_left`).setLabel("⬅️").setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId(`stay`).setLabel("📍").setStyle(ButtonStyle.Secondary),
				new ButtonBuilder().setCustomId(`move_right`).setLabel("➡️").setStyle(ButtonStyle.Primary),
				// new ButtonBuilder().setCustomId(`action_x`).setLabel("X").setStyle(ButtonStyle.Secondary),
				// new ButtonBuilder().setCustomId(`action_y`).setLabel("Y").setStyle(ButtonStyle.Secondary),
			),
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder().setCustomId(`move_down_left`).setLabel("↙️").setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId(`move_down`).setLabel("⬇️").setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId(`move_down_right`).setLabel("↘️").setStyle(ButtonStyle.Primary),
				// new ButtonBuilder().setCustomId(`action_a`).setLabel("A").setStyle(ButtonStyle.Secondary),
				// new ButtonBuilder().setCustomId(`action_b`).setLabel("B").setStyle(ButtonStyle.Secondary),
			),
		];
		
		return interaction.editReply({ 
			content: `${playerView.join('\n')}`,
			// embeds,
			components,
		});
	}
}
