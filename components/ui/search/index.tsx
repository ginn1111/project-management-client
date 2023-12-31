import IconSearch from '@/components/Icon/IconSearch';
import IconXCircle from '@/components/Icon/IconXCircle';
import { cn } from '@/lib/utils';
import { FormEvent, InputHTMLAttributes, forwardRef, useState } from 'react';

interface ISearch extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (e: FormEvent<HTMLFormElement>) => void;
  classNameContainer?: string;
}

const Search = forwardRef<HTMLInputElement, ISearch>((props, ref) => {
  const { classNameContainer, onSearch, ...restInput } = props;
  const [search, setSearch] = useState(false);
  return (
    <div
      className={cn(
        'flex items-center space-x-1.5 ml-auto  space-x-reverse dark:text-[#d0d2d6] sm:flex-1 sm:ml-0 sm:rtl:mr-0 lg:space-x-2',
        classNameContainer
      )}
    >
      <form
        className={`${
          search && '!block'
        } absolute inset-x-0 top-1/2 z-10 mx-4 hidden -translate-y-1/2 sm:relative sm:top-0 sm:mx-0 sm:block sm:translate-y-0 w-full`}
        onSubmit={(e) => {
          onSearch?.(e);
          setSearch(false);
        }}
      >
        <div className="relative">
          <input
            type="text"
            className="form-input bg-gray-100 placeholder:tracking-widest pl-9 pr-9 placeholder:text-sm placeholder:text-muted-foreground placeholder:font-light"
            placeholder="tìm kiếm..."
            ref={ref}
            {...restInput}
          />
          <button
            type="button"
            className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary right-auto rtl:left-auto"
          >
            <IconSearch className="mx-auto" />
          </button>
          <button
            type="button"
            className="absolute top-1/2 block -translate-y-1/2 hover:opacity-80 right-2 rtl:left-2 sm:hidden"
            onClick={() => setSearch(false)}
          >
            <IconXCircle />
          </button>
        </div>
      </form>
      <button
        type="button"
        onClick={() => setSearch(!search)}
        className="search_btn rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 dark:bg-dark/40 dark:hover:bg-dark/60 sm:hidden"
      >
        <IconSearch className="mx-auto h-4.5 w-4.5 dark:text-[#d0d2d6]" />
      </button>
    </div>
  );
});

Search.displayName = 'Search';

export default Search;
