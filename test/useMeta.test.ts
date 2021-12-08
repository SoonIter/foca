import { act, renderHook } from '@testing-library/react-hooks';
import { FocaProvider, store, useMeta } from '../src';
import { MetaStateItem } from '../src/actions/meta';
import { metaStore } from '../src/store/metaStore';
import { basicModel } from './models/basic-model';
import { storeUnmount } from './utils/store';

beforeEach(() => {
  store.init();
  metaStore.helper.refresh();
});

afterEach(() => {
  storeUnmount();
});

test('get meta', async () => {
  const { result } = renderHook(() => useMeta(basicModel.hasError), {
    wrapper: FocaProvider,
  });

  expect(result.current).toStrictEqual<MetaStateItem>({});

  let promise!: Promise<any>;

  act(() => {
    promise = basicModel.hasError();
  });

  expect(result.current).toStrictEqual<MetaStateItem>({
    type: 'pending',
  });

  await act(async () => {
    await expect(promise).rejects.toThrowError();
  });

  expect(result.current).toStrictEqual<MetaStateItem>({
    type: 'rejected',
    message: 'my-test',
  });
});

test('get metas', async () => {
  const { result: result1 } = renderHook(
    () => useMeta(basicModel.hasError, 'pick', 'x'),
    {
      wrapper: FocaProvider,
    },
  );
  const { result: result2 } = renderHook(
    () => useMeta(basicModel.hasError, 'pick', 'y'),
    {
      wrapper: FocaProvider,
    },
  );
  const { result: result3 } = renderHook(
    () => useMeta(basicModel.hasError, 'pick'),
    {
      wrapper: FocaProvider,
    },
  );

  expect(result1.current).toStrictEqual<MetaStateItem>({});
  expect(result2.current).toStrictEqual<MetaStateItem>({});
  expect(result3.current.pick('x')).toStrictEqual<MetaStateItem>({});

  let promise1!: Promise<any>;
  let promise2!: Promise<any>;

  act(() => {
    promise1 = basicModel.hasError.meta('x').execute('aaa');
    promise2 = basicModel.hasError.meta('y').execute('bbb');
  });

  expect(result1.current).toStrictEqual<MetaStateItem>({
    type: 'pending',
  });
  expect(result2.current).toStrictEqual<MetaStateItem>({
    type: 'pending',
  });
  expect(result3.current.pick('x')).toStrictEqual<MetaStateItem>({
    type: 'pending',
  });
  expect(result3.current.pick('xyz')).toStrictEqual<MetaStateItem>({});

  await act(async () => {
    await expect(promise1).rejects.toThrowError();
    await expect(promise2).rejects.toThrowError();
  });

  expect(result1.current).toStrictEqual<MetaStateItem>({
    type: 'rejected',
    message: 'aaa',
  });
  expect(result2.current).toStrictEqual<MetaStateItem>({
    type: 'rejected',
    message: 'bbb',
  });
  expect(result3.current.pick('x')).toStrictEqual<MetaStateItem>({
    type: 'rejected',
    message: 'aaa',
  });
  expect(result3.current.pick('xyz')).toStrictEqual<MetaStateItem>({});
});

test.skip('type checking', () => {
  const meta1 = useMeta(basicModel.bar);
  meta1.message?.trim();
  meta1.type?.valueOf();
  // @ts-expect-error
  meta1.message?.toFixed();

  // @ts-expect-error
  useMeta(basicModel.plus);

  useMeta(basicModel.bar, 'pick', 'xyz').message?.trim();
  const meta2 = useMeta(basicModel.bar, 'pick').pick('m');
  meta2.message?.trim();
  meta2.type?.valueOf();
  // @ts-expect-error
  meta2.message?.toFixed();
});
