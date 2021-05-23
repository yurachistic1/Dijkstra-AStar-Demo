export class MinHeap {
    constructor(){
        this.heap = [];
    }

    toString(){
        return this.heap.toString()
    }

    insert(node){

        this.heap.push(node);
        let childIndex = this.heap.length - 1;

        while(true){
            
            let parentIndex = floor((childIndex - 1) / 2);

            if(parentIndex == -1){break;}

            let child = this.heap[childIndex];
            let parent = this.heap[parentIndex];
            if (child >= parent){
                break;
            } else {
                this.heap[childIndex] = parent;
                this.heap[parentIndex] = child;
            }

            childIndex = parentIndex;
        }
    }

    extract(){
        let root = this.heap[0];
        let newRoot = this.heap[this.heap.length - 1];

        this.heap.pop();
        this.heap[0] = newRoot;

        let parentIndex = 0;

        while(true){

            let parent = this.heap[parentIndex];

            let child1Index = 2 * parentIndex + 1;
            let child2Index = 2 * parentIndex + 2;

            let child1 = child1Index < this.heap.length ? this.heap[child1Index] : Infinity;
            let child2 = child2Index < this.heap.length ? this.heap[child2Index] : Infinity;



            if(parent <= child1 && parent <= child2){
                break;
            } else if (parent > child1 && parent <= child2){
                this.heap[parentIndex] = child1;
                this.heap[child1Index] = parent;
                parentIndex = child1Index;
            } else if (parent <= child1 && parent > child2){
                this.heap[parentIndex] = child2;
                this.heap[child2Index] = parent;
                parentIndex = child2Index;
            } else {
                if (child1 < child2) {
                    this.heap[parentIndex] = child1;
                    this.heap[child1Index] = parent;
                    parentIndex = child1Index;
                } else {
                    this.heap[parentIndex] = child2;
                    this.heap[child2Index] = parent;
                    parentIndex = child2Index;
                }
            }

        }

        return root;
    }
}

export class Node {
    constructor(score, value){
        this.score = score;
        this.value = value;
    }

    valueOf(){
        return this.score;
    }

    toString(){
        return `(score: ${this.score}, val: ${this.value})`
    }
}