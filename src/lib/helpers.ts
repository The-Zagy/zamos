import { Process } from "./types";
interface Queue {
    enqueue(item: Process): void,
    dequeue(): Process,
    isEmpty(): boolean,
    size(): number,
    peek(): Process
}
class Node {
    data: Process;
    next: Node | null;
    constructor(item: Process) {
        this.data = item;
        this.next = null
    }
}
export class PriorityQueue implements Queue {

    private length: number = 0;
    private head: (Node | null) = null;
    constructor() {
        this.length = 0;
        this.head = null;
    }
    enqueue(itm: Process) {
        let node = new Node(itm)
        let cur = this.head;
        let pre = null;
        while (cur != null && itm.cpuTime > cur.data.cpuTime) {
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
    dequeue(): Process {
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
    peek(): Process {
        if (this.length === 0) throw new Error("Nothing to peek at since queue is empty")
        return this.head!.data
    }
}