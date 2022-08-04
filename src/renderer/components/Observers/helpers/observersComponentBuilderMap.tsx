import React from 'react';
import { MapType } from '../../../../types/MapType';
import { GithubAction } from '../../GithubAction';
import { CCTray } from '../../CCTray';
import { DatadogMonitor } from '../../DatadogMonitor';
import { Sentry } from '../../Sentry';
import { NewRelic } from '../../NewRelic';

export const observersComponentBuilderMap: MapType<
  (observable: any, index: number, updateFieldWithValue: any) => JSX.Element
> = {
  githubAction: (observable: any, index: number, updateFieldWithValue: any) => (
    <GithubAction observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} />
  ),
  ccTray: (observable: any, index: number, updateFieldWithValue: any) => (
    <CCTray observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} />
  ),
  datadogMonitor: (observable: any, index: number, updateFieldWithValue: any) => (
    <DatadogMonitor observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} />
  ),
  sentry: (observable: any, index: number, updateFieldWithValue: any) => (
    <Sentry observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} />
  ),
  newRelic: (observable: any, index: number, updateFieldWithValue: any) => (
    <NewRelic observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} />
  ),
};
