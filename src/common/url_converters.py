class HashConverter(object):
    """
    Used in urls.py as hash pattern
    """

    regex = "[0-9a-f]{32,40}"

    def to_python(self, value):
        return str(value)

    def to_url(self, value):
        return str(value)
