
export class MinHeap {
    constructor(){
        this.heap = [];
    }

    toString(){
        return this.heap.toString()
    }

    insert(node){

        this.heap.push(node);
        let index = this.heap.length - 1;
        const current = this.heap[index];

        while(index > 0){
            
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.heap[parentIndex];

            if (parent.lessThan(current)){
                break;
            } else {
                this.heap[parentIndex] = current;
                this.heap[index] = parent;
                index = parentIndex;
            }
        }
    }

    extractMin(){
        let root = this.heap[0];
        const end = this.heap.pop();
        this.heap[0] = end;

        let index = 0;
        const length = this.heap.length;
        const current = this.heap[0];

        while(true){

            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIndex < length) {
                leftChild = this.heap[leftChildIndex];
                if (leftChild.lessThan(current)) swap = leftChildIndex;
            }

            if (rightChildIndex < length) {
                rightChild = this.heap[rightChildIndex];
                if (
                  (swap === null && rightChild.lessThan(current)) ||
                  (swap !== null && rightChild.lessThan(leftChild))
                )
                  swap = rightChildIndex;
            }

            if (swap === null) break;
            this.heap[index] = this.heap[swap];
            this.heap[swap] = current;
            index = swap;
        }
        
        return root;
    }

    isEmpty(){
        return this.heap.length === 0;
    }

    has(node){
        return this.heap.map((i) => {return i.value;}).includes(node.value);
    }
}

export class Node {
    constructor(score, value, inOrder){
        this.score = score;
        this.value = value;
        this.inOrder = inOrder;
    }

    lessThan(node){
        if (this.score < node.score){
            return true;
        } else if (this.score === node.score){
            return this.inOrder < node.inOrder;
        } else {
            return false;
        }
    }

    toString(){
        return `(score: ${this.score}, val: ${this.value})`
    }
}