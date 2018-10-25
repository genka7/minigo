// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Color, Move, Nullable, Point, otherColor} from './base'
import {emptyBoard} from './util'

namespace Annotation {
  export enum Shape {
    Dot,
    Triangle,
  }
}

interface Annotation {
  p: Point;
  shape: Annotation.Shape;
  color: string;
}

class Position {
  search: Move[] = [];
  pv: Move[] = [];
  n: Nullable<number[]> = null;
  dq: Nullable<number[]> = null;
  annotations: Annotation[] = [];

  // children[0] is the main line. Subsequent children are variations.
  children: Position[] = [];

  constructor(public parent: Nullable<Position>,
              public moveNum: number,
              public stones: Color[],
              public lastMove: Nullable<Move>,
              public toPlay: Color) {
    if (lastMove != null && lastMove != 'pass' && lastMove != 'resign') {
      this.annotations.push({
        p: lastMove,
        shape: Annotation.Shape.Dot,
        color: '#ef6c02',
      });
    }
  }

  addChild(move: Move, stones: Color[]) {
    this.children.forEach((child) => {
      if (child.lastMove == move) {
        throw new Error(`Position already has child ${move}`);
      }
    });

    let child = new Position(
      this, this.moveNum + 1, stones, move, otherColor(this.toPlay));
    this.children.push(child);
    return child;
  }
}

export {
  Annotation,
  Position,
};
