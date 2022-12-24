interface Queue<T> {
    enqueue(itm: T): void,
    dequeue(): T,
    isEmpty(): boolean,
    size(): number,
    peek(): T,
}
class Node<T> {
    data: T;
    next: Node<T> | null;
    constructor(itm: T) {
        this.data = itm;
        this.next = null
    }
}
type SortFunction<T> = (cur: T, toBeAdded: T) => boolean
export class PriorityQueue<T> implements Queue<T>{

    private length: number = 0;
    private head: (Node<T> | null) = null;
    private sortFunction: SortFunction<T>
    constructor(sortFn: SortFunction<T>) {
        this.length = 0;
        this.head = null;
        this.sortFunction = sortFn;
    }
    enqueue(itm: T) {
        let node = new Node(itm)
        let cur = this.head;
        let pre = null;
        while (cur != null && this.sortFunction(cur.data, node.data)) {
            pre = cur;
            cur = cur.next;
        }
        //special case queueu is empty or queue has only one item 
        if (pre == null) {
            //cur already has the head so no worried about head
            this.head = node;
        } else {
            pre.next = node;
        }
        node.next = cur;
        this.length++;
    }
    dequeue(): T {
        if (!this.head) {
            throw new Error("Queue is empty");
        }
        const temp = this.head;
        this.head = this.head.next;
        this.length--;
        return temp.data;
    }
    isEmpty(): boolean {
        return !this.head
    }
    size(): number {
        return this.length
    }
    peek(): T {
        if (this.length === 0) throw new Error("Nothing to peek at since queue is empty")
        return this.head!.data
    }
}