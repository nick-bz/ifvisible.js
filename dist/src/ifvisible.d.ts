export declare namespace Events {
    function attach(event: string, callback: Function): void;
    function fire(event: string, args?: any[]): void;
    function remove(event: string, callback: Function): void;
    function dom(element: any, event: string, callback: Function): any;
}
export interface IdleInfo {
    isIdle: boolean;
    idleFor: number;
    timeLeft: number;
    timeLeftPer: number;
}
export declare class Timer {
    private ifvisible;
    private seconds;
    private callback;
    private token;
    stopped: boolean;
    constructor(ifvisible: IfVisible, seconds: number, callback: Function);
    private start();
    stop(): void;
    resume(): void;
    pause(): void;
}
export declare const IE: any;
export declare class IfVisible {
    private root;
    private doc;
    status: string;
    VERSION: string;
    private timer;
    private idleTime;
    private idleStartedTime;
    constructor(root: any, doc: any);
    startIdleTimer(event?: Event): void;
    trackIdleStatus(): void;
    on(event: string, callback: (data: any) => any): IfVisible;
    off(event: string, callback?: any): IfVisible;
    setIdleDuration(seconds: number): IfVisible;
    getIdleDuration(): number;
    getIdleInfo(): IdleInfo;
    idle(callback?: (data: any) => any): IfVisible;
    blur(callback?: (data: any) => any): IfVisible;
    focus(callback?: (data: any) => any): IfVisible;
    wakeup(callback?: (data: any) => any): IfVisible;
    onEvery(seconds: number, callback: Function): Timer;
    now(check?: string): boolean;
}
