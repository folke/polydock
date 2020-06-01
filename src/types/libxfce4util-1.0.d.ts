/**
 * libxfce4util-1.0
 */

import * as Gjs from './Gjs';
import * as GObject from './GObject-2.0';
import * as GLib from './GLib-2.0';

export enum LicenseTextType {
    BSD,
    GPL,
    LGPL,
}
export enum ResourceType {
    DATA,
    CONFIG,
    CACHE,
    ICONS,
    THEMES,
}
export const LOCALE_FULL_MATCH: number
export const LOCALE_NO_MATCH: number
export function expand_variables(command: string, envp: string): string
export function get_dir_localized(directory: string): string
export function get_dir_localized_r(buffer: string, length: number, directory: string): string
export function get_file_localized(filename: string): string
export function get_file_localized_r(buffer: string, length: number, filename: string): string
export function get_homedir(): string
export function get_license_text(license_type: LicenseTextType): string
export function get_path_localized(dst: string, size: number, paths: string, filename: string, test: GLib.FileTest): string
export function get_userdir(): string
export function gethostname(): string
export function locale_match(locale1: string, locale2: string): number
export function mkdirhier(whole_path: string, mode: number): boolean
export function posix_signal_handler_init(): boolean
export function posix_signal_handler_restore_handler(signal: number): void
export function posix_signal_handler_set_handler(signal: number, handler: PosixSignalHandler): boolean
export function posix_signal_handler_shutdown(): void
export function rc_config_open(type: ResourceType, resource: string, readonly: boolean): Rc
export function rc_simple_open(filename: string, readonly: boolean): Rc
export function resource_dirs(type: ResourceType): string[]
export function resource_lookup(type: ResourceType, filename: string): string
export function resource_lookup_all(type: ResourceType, filename: string): string[]
export function resource_match(type: ResourceType, pattern: string, unique: boolean): string[]
export function resource_match_custom(type: ResourceType, unique: boolean, func: MatchFunc): string[]
export function resource_pop_path(type: ResourceType): void
export function resource_push_path(type: ResourceType, path: string): void
export function resource_save_location(type: ResourceType, relpath: string, create: boolean): string
export function textdomain(package: string, localedir: string, encoding: string): void
export function utf8_remove_controls(str: string, max_len: number, end: string): string
export function utf8_strndup(src: string, max_len: number): string
export function version_string(): string
export interface MatchFunc {
    (basedir: string, relpath: string): boolean
}
export interface PosixSignalHandler {
    (signal: number): void
}
export interface Kiosk_ConstructProps extends GObject.Object_ConstructProps {
}
export class Kiosk {
    /* Fields of GObject.Object */
    g_type_instance: GObject.TypeInstance
    /* Methods of libxfce4util.Kiosk */
    free(): void
    query(capability: string): boolean
    /* Methods of GObject.Object */
    bind_property(source_property: string, target: GObject.Object, target_property: string, flags: GObject.BindingFlags): GObject.Binding
    bind_property_full(source_property: string, target: GObject.Object, target_property: string, flags: GObject.BindingFlags, transform_to: GObject.Closure, transform_from: GObject.Closure): GObject.Binding
    force_floating(): void
    freeze_notify(): void
    get_data(key: string): object | null
    get_property(property_name: string, value: GObject.Value): void
    get_qdata(quark: GLib.Quark): object | null
    getv(names: string[], values: GObject.Value[]): void
    is_floating(): boolean
    notify(property_name: string): void
    notify_by_pspec(pspec: GObject.ParamSpec): void
    ref(): GObject.Object
    ref_sink(): GObject.Object
    run_dispose(): void
    set_data(key: string, data?: object | null): void
    set_property(property_name: string, value: GObject.Value): void
    steal_data(key: string): object | null
    steal_qdata(quark: GLib.Quark): object | null
    thaw_notify(): void
    unref(): void
    watch_closure(closure: GObject.Closure): void
    /* Virtual methods of GObject.Object */
    vfunc_constructed?(): void
    vfunc_dispatch_properties_changed?(n_pspecs: number, pspecs: GObject.ParamSpec): void
    vfunc_dispose?(): void
    vfunc_finalize?(): void
    vfunc_get_property?(property_id: number, value: GObject.Value, pspec: GObject.ParamSpec): void
    vfunc_notify?(pspec: GObject.ParamSpec): void
    vfunc_set_property?(property_id: number, value: GObject.Value, pspec: GObject.ParamSpec): void
    /* Signals of GObject.Object */
    connect(sigName: "notify", callback: (($obj: Kiosk, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify", callback: (($obj: Kiosk, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify", pspec: GObject.ParamSpec): void
    connect(sigName: string, callback: any): number
    connect_after(sigName: string, callback: any): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
    static name: string
    constructor (config?: Kiosk_ConstructProps)
    _init (config?: Kiosk_ConstructProps): void
    static new(module: string): Kiosk
    static $gtype: GObject.Type
}
export abstract class KioskClass {
    /* Fields of libxfce4util.KioskClass */
    parent_class: GObject.ObjectClass
    static name: string
}
export class Rc {
    /* Methods of libxfce4util.Rc */
    close(): void
    delete_entry(key: string, global: boolean): void
    delete_group(group: string, global: boolean): void
    flush(): void
    get_entries(group: string): string[]
    get_group(): string
    get_groups(): string[]
    get_locale(): string
    has_entry(key: string): boolean
    has_group(group: string): boolean
    is_dirty(): boolean
    is_readonly(): boolean
    read_bool_entry(key: string, fallback: boolean): boolean
    read_entry(key: string, fallback: string): string
    read_entry_untranslated(key: string, fallback: string): string
    read_int_entry(key: string, fallback: number): number
    read_list_entry(key: string, delimiter: string): string[]
    rollback(): void
    set_group(group: string): void
    write_bool_entry(key: string, value: boolean): void
    write_entry(key: string, value: string): void
    write_int_entry(key: string, value: number): void
    write_list_entry(key: string, value: string, separator: string): void
    static name: string
    static config_open(type: ResourceType, resource: string, readonly: boolean): Rc
    static simple_open(filename: string, readonly: boolean): Rc
}