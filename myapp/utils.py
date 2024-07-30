from django.core.cache import cache

def cache_queryset(queryset, cache_key, timeout=60*15):
    """
    Cache a queryset or retrieve it from cache.
    """
    # Try to get data from cache
    data = cache.get(cache_key)
    
    if data is None:
        # Data not in cache, query the database and cache it
        data = list(queryset)  # Convert queryset to list
        cache.set(cache_key, data, timeout)
        print(f"Data cached with key: {cache_key}")
    else:
        print(f"Data retrieved from cache with key: {cache_key}")
    
    return data
