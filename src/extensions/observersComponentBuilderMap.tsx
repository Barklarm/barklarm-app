import React from 'react';
import { MapType } from '../types/MapType';
import { GithubAction } from './github/component';
import { CCTray } from './cctray/component';
import { DatadogMonitor } from './datadog/component';
import { Sentry } from './sentry/component';
import { NewRelic } from './newRelic/component';
import { Grafana } from './grafana/component';

export const observersComponentBuilderMap: MapType<
  (observable: any, index: number, updateFieldWithValue: any, translate: any) => JSX.Element
> = {
  githubAction: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <GithubAction
      observable={observable}
      index={index}
      updateFieldWithValue={updateFieldWithValue}
      translate={translate}
    />
  ),
  ccTray: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <CCTray observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} translate={translate} />
  ),
  datadogMonitor: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <DatadogMonitor
      observable={observable}
      index={index}
      updateFieldWithValue={updateFieldWithValue}
      translate={translate}
    />
  ),
  sentry: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <Sentry observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} translate={translate} />
  ),
  newRelic: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <NewRelic observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} translate={translate} />
  ),
  grafana: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <Grafana observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} translate={translate} />
  ),
};
