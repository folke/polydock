/**
 * Xfconf-0
 */

import * as Gjs from './Gjs';
import * as Gio from './Gio-2.0';
import * as GObject from './GObject-2.0';
import * as GLib from './GLib-2.0';

export enum Error {
    UNKNOWN,
    CHANNELNOTFOUND,
    PROPERTYNOTFOUND,
    READFAILURE,
    WRITEFAILURE,
    PERMISSIONDENIED,
    INTERNALERROR,
    NOBACKEND,
    INVALIDPROPERTY,
    INVALIDCHANNEL,
}
export function array_free(arr: any): void
export function get_error_quark(): GLib.Quark
export function init(): boolean
export function list_channels(): string[]
export function named_struct_register(struct_name: string, n_members: number, member_types: any): void
export function property_bind(channel: Channel, xfconf_property: string, xfconf_property_type: GObject.Type, object: object | null, object_property: string): number
export function property_bind_gdkcolor(channel: Channel, xfconf_property: string, object: object | null, object_property: string): number
export function property_bind_gdkrgba(channel: Channel, xfconf_property: string, object: object | null, object_property: string): number
export function property_unbind(id: number): void
export function property_unbind_all(channel_or_object?: object | null): void
export function property_unbind_by_property(channel: Channel, xfconf_property: string, object: object | null, object_property: string): void
export function shutdown(): void
export function value_get_int16(value: any): number
export function value_get_uint16(value: any): number
export function value_set_int16(value: any, v_int16: number): void
export function value_set_uint16(value: any, v_uint16: number): void
export interface Channel_ConstructProps extends GObject.Object_ConstructProps {
    channel_name?: string
    is_singleton?: boolean
    property_base?: string
}
export class Channel {
    /* Properties of Xfconf.Channel */
    /* Fields of GObject.Object */
    g_type_instance: GObject.TypeInstance
    /* Methods of Xfconf.Channel */
    get_arrayv(property: string): any
    get_bool(property: string, default_value: boolean): boolean
    get_double(property: string, default_value: number): number
    get_int(property: string, default_value: number): number
    get_named_struct(property: string, struct_name: string, value_struct?: object | null): boolean
    get_properties(property_base: string): GLib.HashTable
    get_property(property: string, value: any): boolean
    get_string(property: string, default_value: string): string
    get_string_list(property: string): string[]
    get_structv(property: string, value_struct: object | null, n_members: number, member_types: any): boolean
    get_uint(property: string, default_value: number): number
    get_uint64(property: string, default_value: number): number
    has_property(property: string): boolean
    is_property_locked(property: string): boolean
    reset_property(property_base: string, recursive: boolean): void
    set_arrayv(property: string, values: any): boolean
    set_bool(property: string, value: boolean): boolean
    set_double(property: string, value: number): boolean
    set_int(property: string, value: number): boolean
    set_named_struct(property: string, struct_name: string, value_struct?: object | null): boolean
    set_property(property: string, value: any): boolean
    set_string(property: string, value: string): boolean
    set_string_list(property: string, values: string): boolean
    set_structv(property: string, value_struct: object | null, n_members: number, member_types: any): boolean
    set_uint(property: string, value: number): boolean
    set_uint64(property: string, value: number): boolean
    /* Methods of GObject.Object */
    bind_property(source_property: string, target: GObject.Object, target_property: string, flags: GObject.BindingFlags): GObject.Binding
    bind_property_full(source_property: string, target: GObject.Object, target_property: string, flags: GObject.BindingFlags, transform_to: GObject.Closure, transform_from: GObject.Closure): GObject.Binding
    force_floating(): void
    freeze_notify(): void
    get_data(key: string): object | null
    get_qdata(quark: GLib.Quark): object | null
    getv(names: string[], values: GObject.Value[]): void
    is_floating(): boolean
    notify(property_name: string): void
    notify_by_pspec(pspec: GObject.ParamSpec): void
    ref(): GObject.Object
    ref_sink(): GObject.Object
    run_dispose(): void
    set_data(key: string, data?: object | null): void
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
    /* Signals of Xfconf.Channel */
    connect(sigName: "property-changed", callback: (($obj: Channel, property: string, value: any) => void)): number
    connect_after(sigName: "property-changed", callback: (($obj: Channel, property: string, value: any) => void)): number
    emit(sigName: "property-changed", property: string, value: any): void
    /* Signals of GObject.Object */
    connect(sigName: "notify", callback: (($obj: Channel, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify", callback: (($obj: Channel, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify", pspec: GObject.ParamSpec): void
    connect(sigName: string, callback: any): number
    connect_after(sigName: string, callback: any): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
    static name: string
    constructor (config?: Channel_ConstructProps)
    _init (config?: Channel_ConstructProps): void
    static new(channel_name: string): Channel
    static new_with_property_base(channel_name: string, property_base: string): Channel
    static get(channel_name: string): Channel
    static $gtype: GObject.Type
}
export class Int16 {
    static name: string
}
export class Uint16 {
    static name: string
}